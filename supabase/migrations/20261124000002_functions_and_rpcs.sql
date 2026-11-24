-- AccessPath Triggers, Business Logic & PostGIS RPC Functions

-- 1. SEARCH VECTOR GENERATOR
CREATE OR REPLACE FUNCTION public.locations_search_vector_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.address, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_locations_search_vector ON public.locations;
CREATE TRIGGER trg_locations_search_vector
BEFORE INSERT OR UPDATE OF name, address, description ON public.locations
FOR EACH ROW EXECUTE FUNCTION public.locations_search_vector_trigger();

-- 2. AUTO PROFILE CREATION ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, avatar_url, trust_score)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role),
        NEW.raw_user_meta_data->>'avatar_url',
        10
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RECOMPUTE ACCESSIBILITY SCORE
-- Calculates score based on:
-- Features (0-55 pts), Community Feedback (0-25 pts), Nearby Barriers penalty (-0 to -30 pts)
CREATE OR REPLACE FUNCTION public.recompute_location_score(loc_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    feat RECORD;
    fb_avg NUMERIC;
    barrier_count INTEGER;
    calculated_score NUMERIC := 50.00;
    feature_points NUMERIC := 0;
    feedback_points NUMERIC := 0;
    barrier_penalty NUMERIC := 0;
    loc_geom GEOGRAPHY;
BEGIN
    SELECT coordinates INTO loc_geom FROM public.locations WHERE id = loc_id;
    IF loc_geom IS NULL THEN
        RETURN 50.00;
    END IF;

    -- Feature points (max 55)
    SELECT * INTO feat FROM public.accessibility_features WHERE location_id = loc_id;
    IF FOUND THEN
        IF feat.wheelchair_access THEN feature_points := feature_points + 15; END IF;
        IF feat.ramp_available THEN feature_points := feature_points + 10; END IF;
        IF feat.elevator_available THEN feature_points := feature_points + 8; END IF;
        IF feat.stair_free_entry THEN feature_points := feature_points + 8; END IF;
        IF feat.accessible_restroom THEN feature_points := feature_points + 6; END IF;
        IF feat.accessible_parking THEN feature_points := feature_points + 4; END IF;
        IF feat.door_accessible THEN feature_points := feature_points + 4; END IF;
    END IF;

    -- Feedback points (max 25): average rating mapped 1-5 -> 5-25
    SELECT AVG(rating) INTO fb_avg FROM public.feedback WHERE location_id = loc_id;
    IF fb_avg IS NOT NULL THEN
        feedback_points := (fb_avg / 5.0) * 25.0;
    ELSE
        feedback_points := 12.5; -- neutral default
    END IF;

    -- Barrier penalty (within 100 meters, verified at full weight, pending at 40%)
    SELECT COALESCE(SUM(
        CASE 
            WHEN status = 'verified' THEN 6.0
            WHEN status = 'pending' THEN 2.4
            ELSE 0.0
        END
    ), 0) INTO barrier_penalty
    FROM public.barrier_reports
    WHERE status IN ('verified', 'pending')
      AND ST_DWithin(coordinates, loc_geom, 100);

    -- Base 20 + features + feedback - barrier penalty (bounded 0 to 100)
    calculated_score := 20.0 + feature_points + feedback_points - barrier_penalty;
    calculated_score := GREATEST(0.0, LEAST(100.0, calculated_score));

    UPDATE public.locations
    SET accessibility_score = ROUND(calculated_score, 2),
        updated_at = timezone('utc'::text, now())
    WHERE id = loc_id;

    RETURN ROUND(calculated_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. DUPLICATE LOCATION DETECTION RPC
-- Identifies places within 50m with trigram similarity > 0.4
CREATE OR REPLACE FUNCTION public.check_duplicate_location(
    check_name TEXT,
    check_lng DOUBLE PRECISION,
    check_lat DOUBLE PRECISION,
    exclude_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    address TEXT,
    distance_meters DOUBLE PRECISION,
    similarity DOUBLE PRECISION
) AS $$
DECLARE
    pt GEOGRAPHY := ST_SetSRID(ST_MakePoint(check_lng, check_lat), 4326)::geography;
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.name,
        l.address,
        ST_Distance(l.coordinates, pt) AS distance_meters,
        similarity(l.name, check_name)::DOUBLE PRECISION AS similarity
    FROM public.locations l
    WHERE (exclude_id IS NULL OR l.id != exclude_id)
      AND ST_DWithin(l.coordinates, pt, 50)
      AND similarity(l.name, check_name) > 0.4
    ORDER BY distance_meters ASC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. SEARCH LOCATIONS RPC WITH FULL FILTERING & PAGINATION
CREATE OR REPLACE FUNCTION public.search_locations(
    query TEXT DEFAULT NULL,
    user_lat DOUBLE PRECISION DEFAULT NULL,
    user_lng DOUBLE PRECISION DEFAULT NULL,
    radius_m DOUBLE PRECISION DEFAULT NULL,
    category_ids UUID[] DEFAULT NULL,
    features JSONB DEFAULT NULL,
    min_score NUMERIC DEFAULT NULL,
    sort_by TEXT DEFAULT 'score_desc', -- 'score_desc', 'distance_asc', 'name_asc', 'newest'
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 12
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category_id UUID,
    category_name TEXT,
    category_slug TEXT,
    accessibility_score NUMERIC,
    verification_status verification_status,
    distance_m DOUBLE PRECISION,
    total_count BIGINT,
    wheelchair_access BOOLEAN,
    ramp_available BOOLEAN,
    elevator_available BOOLEAN,
    accessible_restroom BOOLEAN,
    accessible_parking BOOLEAN,
    stair_free_entry BOOLEAN,
    door_accessible BOOLEAN
) AS $$
DECLARE
    user_pt GEOGRAPHY := CASE 
        WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL 
        THEN ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography 
        ELSE NULL 
    END;
    offset_val INTEGER := (GREATEST(1, page_num) - 1) * page_size;
BEGIN
    RETURN QUERY
    WITH filtered_locs AS (
        SELECT 
            l.id,
            l.name,
            l.description,
            l.address,
            ST_Y(l.coordinates::geometry) AS latitude,
            ST_X(l.coordinates::geometry) AS longitude,
            l.category_id,
            c.name AS category_name,
            c.slug AS category_slug,
            l.accessibility_score,
            l.verification_status,
            CASE 
                WHEN user_pt IS NOT NULL THEN ST_Distance(l.coordinates, user_pt)
                ELSE NULL 
            END AS distance_m,
            COALESCE(af.wheelchair_access, false) AS wheelchair_access,
            COALESCE(af.ramp_available, false) AS ramp_available,
            COALESCE(af.elevator_available, false) AS elevator_available,
            COALESCE(af.accessible_restroom, false) AS accessible_restroom,
            COALESCE(af.accessible_parking, false) AS accessible_parking,
            COALESCE(af.stair_free_entry, false) AS stair_free_entry,
            COALESCE(af.door_accessible, false) AS door_accessible
        FROM public.locations l
        LEFT JOIN public.categories c ON l.category_id = c.id
        LEFT JOIN public.accessibility_features af ON l.id = af.location_id
        WHERE 
            (query IS NULL OR query = '' OR l.search_vector @@ plainto_tsquery('english', query) OR l.name ILIKE '%' || query || '%' OR l.address ILIKE '%' || query || '%')
            AND (category_ids IS NULL OR l.category_id = ANY(category_ids))
            AND (min_score IS NULL OR l.accessibility_score >= min_score)
            AND (user_pt IS NULL OR radius_m IS NULL OR ST_DWithin(l.coordinates, user_pt, radius_m))
            -- JSON features filter:
            AND (features IS NULL OR (
                (NOT (features ? 'wheelchair_access') OR af.wheelchair_access = (features->>'wheelchair_access')::boolean) AND
                (NOT (features ? 'ramp_available') OR af.ramp_available = (features->>'ramp_available')::boolean) AND
                (NOT (features ? 'elevator_available') OR af.elevator_available = (features->>'elevator_available')::boolean) AND
                (NOT (features ? 'accessible_restroom') OR af.accessible_restroom = (features->>'accessible_restroom')::boolean) AND
                (NOT (features ? 'accessible_parking') OR af.accessible_parking = (features->>'accessible_parking')::boolean) AND
                (NOT (features ? 'stair_free_entry') OR af.stair_free_entry = (features->>'stair_free_entry')::boolean) AND
                (NOT (features ? 'door_accessible') OR af.door_accessible = (features->>'door_accessible')::boolean)
            ))
    ),
    counted AS (
        SELECT COUNT(*) AS total_rows FROM filtered_locs
    )
    SELECT 
        fl.id,
        fl.name,
        fl.description,
        fl.address,
        fl.latitude,
        fl.longitude,
        fl.category_id,
        fl.category_name,
        fl.category_slug,
        fl.accessibility_score,
        fl.verification_status,
        fl.distance_m,
        cnt.total_rows,
        fl.wheelchair_access,
        fl.ramp_available,
        fl.elevator_available,
        fl.accessible_restroom,
        fl.accessible_parking,
        fl.stair_free_entry,
        fl.door_accessible
    FROM filtered_locs fl
    CROSS JOIN counted cnt
    ORDER BY
        CASE WHEN sort_by = 'distance_asc' AND user_pt IS NOT NULL THEN fl.distance_m END ASC NULLS LAST,
        CASE WHEN sort_by = 'score_desc' THEN fl.accessibility_score END DESC,
        CASE WHEN sort_by = 'name_asc' THEN fl.name END ASC,
        fl.accessibility_score DESC
    LIMIT page_size
    OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. BBOX CLUSTERING RPC FOR LEAFLET MAP
CREATE OR REPLACE FUNCTION public.locations_in_bbox(
    min_lng DOUBLE PRECISION,
    min_lat DOUBLE PRECISION,
    max_lng DOUBLE PRECISION,
    max_lat DOUBLE PRECISION,
    zoom_level INTEGER DEFAULT 14
)
RETURNS JSONB AS $$
DECLARE
    bbox_geom GEOMETRY;
    grid_size DOUBLE PRECISION;
    result JSONB;
BEGIN
    bbox_geom := ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326);

    -- If high zoom level (detail view), return individual points
    IF zoom_level >= 14 THEN
        SELECT jsonb_agg(
            jsonb_build_object(
                'type', 'point',
                'id', l.id,
                'name', l.name,
                'category_id', l.category_id,
                'accessibility_score', l.accessibility_score,
                'verification_status', l.verification_status,
                'lat', ST_Y(l.coordinates::geometry),
                'lng', ST_X(l.coordinates::geometry)
            )
        ) INTO result
        FROM public.locations l
        WHERE ST_Intersects(l.coordinates::geometry, bbox_geom)
        LIMIT 500;
    ELSE
        -- Lower zoom: Grid clustering using ST_SnapToGrid
        grid_size := CASE
            WHEN zoom_level <= 6 THEN 0.5
            WHEN zoom_level <= 9 THEN 0.1
            WHEN zoom_level <= 11 THEN 0.03
            ELSE 0.01
        END;

        SELECT jsonb_agg(
            jsonb_build_object(
                'type', 'cluster',
                'count', sub.cnt,
                'avg_score', sub.avg_score,
                'lat', ST_Y(sub.centroid),
                'lng', ST_X(sub.centroid)
            )
        ) INTO result
        FROM (
            SELECT 
                COUNT(*) AS cnt,
                ROUND(AVG(accessibility_score), 1) AS avg_score,
                ST_Centroid(ST_Collect(coordinates::geometry)) AS centroid
            FROM public.locations
            WHERE ST_Intersects(coordinates::geometry, bbox_geom)
            GROUP BY ST_SnapToGrid(coordinates::geometry, grid_size)
        ) sub;
    END IF;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE;

-- 7. BARRIERS NEAR LINE (FOR ROUTE ACCESSIBILITY SCORING)
CREATE OR REPLACE FUNCTION public.barriers_near_line(
    route_geojson JSONB,
    buffer_meters DOUBLE PRECISION DEFAULT 30.0
)
RETURNS TABLE (
    id UUID,
    category barrier_category,
    description TEXT,
    image_url TEXT,
    status barrier_status,
    distance_to_route DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
) AS $$
DECLARE
    route_geom GEOMETRY;
BEGIN
    route_geom := ST_SetSRID(ST_GeomFromGeoJSON(route_geojson), 4326);
    RETURN QUERY
    SELECT 
        b.id,
        b.category,
        b.description,
        b.image_url,
        b.status,
        ST_Distance(b.coordinates, route_geom::geography) AS distance_to_route,
        ST_Y(b.coordinates::geometry) AS latitude,
        ST_X(b.coordinates::geometry) AS longitude
    FROM public.barrier_reports b
    WHERE ST_DWithin(b.coordinates, route_geom::geography, buffer_meters)
      AND b.status IN ('verified', 'pending')
    ORDER BY distance_to_route ASC;
END;
$$ LANGUAGE plpgsql STABLE;
