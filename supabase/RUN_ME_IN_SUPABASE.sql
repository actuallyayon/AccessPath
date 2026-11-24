-- AccessPath Complete Database Setup Script
-- Copy all of this script and paste it into Supabase SQL Editor -> Click RUN

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'contributor', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE barrier_category AS ENUM (
        'broken_footpath',
        'missing_ramp',
        'blocked_sidewalk',
        'broken_elevator',
        'unsafe_crossing'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE barrier_status AS ENUM ('pending', 'verified', 'rejected', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    trust_score INTEGER NOT NULL DEFAULT 0,
    preferences JSONB NOT NULL DEFAULT '{"avoid_stairs": true, "max_incline_deg": 8, "require_elevators": false}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'MapPin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    accessibility_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00 CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    search_vector TSVECTOR,
    CONSTRAINT chk_coordinates_valid CHECK (
        ST_X(coordinates::geometry) >= -180 AND ST_X(coordinates::geometry) <= 180 AND
        ST_Y(coordinates::geometry) >= -90 AND ST_Y(coordinates::geometry) <= 90
    )
);

CREATE TABLE IF NOT EXISTS public.accessibility_features (
    location_id UUID PRIMARY KEY REFERENCES public.locations(id) ON DELETE CASCADE,
    wheelchair_access BOOLEAN NOT NULL DEFAULT false,
    ramp_available BOOLEAN NOT NULL DEFAULT false,
    elevator_available BOOLEAN NOT NULL DEFAULT false,
    accessible_restroom BOOLEAN NOT NULL DEFAULT false,
    accessible_parking BOOLEAN NOT NULL DEFAULT false,
    stair_free_entry BOOLEAN NOT NULL DEFAULT false,
    door_accessible BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.location_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.barrier_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category barrier_category NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    coordinates GEOGRAPHY(Point, 4326) NOT NULL,
    status barrier_status NOT NULL DEFAULT 'pending',
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_barrier_coords_valid CHECK (
        ST_X(coordinates::geometry) >= -180 AND ST_X(coordinates::geometry) <= 180 AND
        ST_Y(coordinates::geometry) >= -90 AND ST_Y(coordinates::geometry) <= 90
    )
);

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, location_id)
);

CREATE TABLE IF NOT EXISTS public.contribution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON public.locations USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS idx_locations_search_vector ON public.locations USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_locations_name_trgm ON public.locations USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_locations_address_trgm ON public.locations USING GIN (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_locations_category_id ON public.locations (category_id);
CREATE INDEX IF NOT EXISTS idx_locations_verification_status ON public.locations (verification_status);
CREATE INDEX IF NOT EXISTS idx_locations_accessibility_score ON public.locations (accessibility_score);
CREATE INDEX IF NOT EXISTS idx_locations_created_at ON public.locations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_barriers_coordinates ON public.barrier_reports USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS idx_barriers_status ON public.barrier_reports (status);
CREATE INDEX IF NOT EXISTS idx_barriers_category ON public.barrier_reports (category);
CREATE INDEX IF NOT EXISTS idx_barriers_reporter_id ON public.barrier_reports (reporter_id);

CREATE INDEX IF NOT EXISTS idx_feedback_location_id ON public.feedback (location_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback (user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON public.contribution_history (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

-- 5. TRIGGERS & RPC FUNCTIONS
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

CREATE OR REPLACE FUNCTION public.search_locations(
    query TEXT DEFAULT NULL,
    user_lat DOUBLE PRECISION DEFAULT NULL,
    user_lng DOUBLE PRECISION DEFAULT NULL,
    radius_m DOUBLE PRECISION DEFAULT NULL,
    category_ids UUID[] DEFAULT NULL,
    features JSONB DEFAULT NULL,
    min_score NUMERIC DEFAULT NULL,
    sort_by TEXT DEFAULT 'score_desc',
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

CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS JSONB AS $$
DECLARE
    total_locations BIGINT;
    verified_locations BIGINT;
    pending_locations BIGINT;
    total_barriers BIGINT;
    resolved_barriers BIGINT;
    pending_barriers BIGINT;
    total_users BIGINT;
    total_feedback BIGINT;
    result JSONB;
BEGIN
    SELECT COUNT(*) INTO total_locations FROM public.locations;
    SELECT COUNT(*) INTO verified_locations FROM public.locations WHERE verification_status = 'verified';
    SELECT COUNT(*) INTO pending_locations FROM public.locations WHERE verification_status = 'pending';

    SELECT COUNT(*) INTO total_barriers FROM public.barrier_reports;
    SELECT COUNT(*) INTO resolved_barriers FROM public.barrier_reports WHERE status = 'resolved';
    SELECT COUNT(*) INTO pending_barriers FROM public.barrier_reports WHERE status = 'pending';

    SELECT COUNT(*) INTO total_users FROM public.profiles;
    SELECT COUNT(*) INTO total_feedback FROM public.feedback;

    result := jsonb_build_object(
        'total_locations', total_locations,
        'verified_locations', verified_locations,
        'pending_locations', pending_locations,
        'total_barriers', total_barriers,
        'resolved_barriers', resolved_barriers,
        'pending_barriers', pending_barriers,
        'total_users', total_users,
        'total_feedback', total_feedback
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_category_distribution()
RETURNS TABLE (
    category_id UUID,
    name TEXT,
    slug TEXT,
    icon TEXT,
    location_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS category_id,
        c.name,
        c.slug,
        c.icon,
        COUNT(l.id) AS location_count
    FROM public.categories c
    LEFT JOIN public.locations l ON c.id = l.category_id
    GROUP BY c.id, c.name, c.slug, c.icon
    ORDER BY location_count DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_monthly_trends()
RETURNS TABLE (
    month TEXT,
    locations_added BIGINT,
    barriers_reported BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH months AS (
        SELECT to_char(d, 'YYYY-MM') AS m
        FROM generate_series(
            date_trunc('month', now()) - interval '5 months',
            date_trunc('month', now()),
            interval '1 month'
        ) AS d
    ),
    loc_counts AS (
        SELECT to_char(created_at, 'YYYY-MM') AS m, COUNT(*) AS count
        FROM public.locations
        WHERE created_at >= (now() - interval '6 months')
        GROUP BY 1
    ),
    bar_counts AS (
        SELECT to_char(created_at, 'YYYY-MM') AS m, COUNT(*) AS count
        FROM public.barrier_reports
        WHERE created_at >= (now() - interval '6 months')
        GROUP BY 1
    )
    SELECT 
        months.m AS month,
        COALESCE(lc.count, 0) AS locations_added,
        COALESCE(bc.count, 0) AS barriers_reported
    FROM months
    LEFT JOIN loc_counts lc ON months.m = lc.m
    LEFT JOIN bar_counts bc ON months.m = bc.m
    ORDER BY months.m ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barrier_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles readable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Categories readable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Locations readable by all" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Accessibility features readable by all" ON public.accessibility_features FOR SELECT USING (true);
CREATE POLICY "Location photos readable by all" ON public.location_photos FOR SELECT USING (true);
CREATE POLICY "Barrier reports readable by all" ON public.barrier_reports FOR SELECT USING (true);
CREATE POLICY "Feedback readable by all" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Favorites user access" ON public.favorites FOR ALL TO authenticated USING (user_id = auth.uid());

-- 7. INITIAL CATEGORIES
INSERT INTO public.categories (id, name, slug, icon)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Public Buildings', 'public-buildings', 'Building2'),
    ('c2222222-2222-2222-2222-222222222222', 'Parks & Recreation', 'parks-recreation', 'Trees'),
    ('c3333333-3333-3333-3333-333333333333', 'Educational Institutions', 'educational-institutions', 'GraduationCap'),
    ('c4444444-4444-4444-4444-444444444444', 'Transportation Facilities', 'transportation-facilities', 'Bus'),
    ('c5555555-5555-5555-5555-555555555555', 'Government Offices', 'government-offices', 'Landmark'),
    ('c6666666-6666-6666-6666-666666666666', 'Community Centers', 'community-centers', 'Users')
ON CONFLICT (slug) DO NOTHING;
