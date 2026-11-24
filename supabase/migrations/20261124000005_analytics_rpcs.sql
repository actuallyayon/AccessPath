-- AccessPath Analytics RPC Functions

-- 1. Analytics Summary Overview
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

-- 2. Category Distribution
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

-- 3. Monthly Barrier & Location Trends
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

-- 4. Most Reported Barrier Clusters / Areas (ST_SnapToGrid)
CREATE OR REPLACE FUNCTION public.get_barrier_hotspots(limit_num INTEGER DEFAULT 10)
RETURNS TABLE (
    grid_lat DOUBLE PRECISION,
    grid_lng DOUBLE PRECISION,
    barrier_count BIGINT,
    primary_category barrier_category
) AS $$
BEGIN
    RETURN QUERY
    WITH clustered AS (
        SELECT 
            ST_Centroid(ST_Collect(coordinates::geometry)) AS centroid,
            COUNT(*) AS cnt,
            mode() WITHIN GROUP (ORDER BY category) AS dominant_category
        FROM public.barrier_reports
        GROUP BY ST_SnapToGrid(coordinates::geometry, 0.01)
    )
    SELECT 
        ST_Y(c.centroid) AS grid_lat,
        ST_X(c.centroid) AS grid_lng,
        c.cnt AS barrier_count,
        c.dominant_category AS primary_category
    FROM clustered c
    ORDER BY c.cnt DESC
    LIMIT limit_num;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
