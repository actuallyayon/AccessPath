-- AccessPath High-Scale Synthetic Seed Script
-- Generates:
-- 1. 10,000+ realistic locations across Dhaka, Khulna, Chittagong, Sylhet, London, New York, Tokyo
-- 2. 50,000+ realistic barrier reports
-- 3. 100,000+ realistic feedback records
-- 4. Matching accessibility_features for all locations
-- 5. Complete with varied verification statuses, valid coordinates & search vectors
-- 6. Performance-tuned via batch inserts using generate_series and UNNEST

BEGIN;

-- Temporarily disable audit triggers if any for batch performance
SET LOCAL synchronous_commit = OFF;

-- Clean existing seed data cleanly if re-run (idempotent)
-- Leave default categories intact
DELETE FROM public.barrier_reports WHERE description LIKE '%[AccessPath Synthetic]%';
DELETE FROM public.feedback WHERE comment LIKE '%[AccessPath Synthetic]%';
DELETE FROM public.locations WHERE description LIKE '%[AccessPath Synthetic]%';

-- Define Anchor Cities & Coordinates:
-- Dhaka: 23.8103, 90.4125
-- Khulna: 22.8456, 89.5403
-- Chittagong: 22.3569, 91.7832
-- Sylhet: 24.8949, 91.8687
-- New York: 40.7128, -74.0060
-- London: 51.5074, -0.1278

WITH category_pool AS (
    SELECT array_agg(id) as cat_ids FROM public.categories
),
city_centers AS (
    SELECT * FROM (VALUES
        ('Dhaka', 23.8103, 90.4125, 3000),
        ('Khulna', 22.8456, 89.5403, 2000),
        ('Chittagong', 22.3569, 91.7832, 1500),
        ('Sylhet', 24.8949, 91.8687, 1000),
        ('London', 51.5074, -0.1278, 1500),
        ('New York', 40.7128, -74.0060, 1000)
    ) AS t(city, center_lat, center_lng, quota)
),
prefixes AS (
    SELECT ARRAY['Central', 'National', 'Metro', 'City', 'Apex', 'Royal', 'Premier', 'Sunrise', 'Green', 'Civic', 'Community', 'Standard'] AS arr
),
place_types AS (
    SELECT ARRAY['Hospital', 'Library', 'Metro Station', 'Public Park', 'University Campus', 'Health Complex', 'Shopping Mall', 'Government Complex', 'Civic Center', 'Railway Terminal', 'Cultural Hall', 'Auditorium'] AS arr
),
streets AS (
    SELECT ARRAY['Mirpur Road', 'Kazi Nazrul Islam Ave', 'Khan Jahan Ali Road', 'Mujib Sadak', 'Station Road', 'Airport Ave', 'Broadway', 'King Street', 'Oxford St', 'Commercial Zone', 'College Rd', 'Park Avenue'] AS arr
)
INSERT INTO public.locations (
    id,
    name,
    description,
    address,
    coordinates,
    category_id,
    accessibility_score,
    verification_status,
    created_at
)
SELECT 
    gen_random_uuid() AS id,
    (prefixes.arr)[1 + floor(random() * array_length(prefixes.arr, 1))::int] || ' ' ||
    (place_types.arr)[1 + floor(random() * array_length(place_types.arr, 1))::int] || ' #' || i AS name,
    'Accessibility-assessed urban facility with public access points. [AccessPath Synthetic]' AS description,
    floor(1 + random() * 450)::text || ' ' || (streets.arr)[1 + floor(random() * array_length(streets.arr, 1))::int] || ', ' || c.city AS address,
    ST_SetSRID(ST_MakePoint(
        c.center_lng + (random() - 0.5) * 0.14,
        c.center_lat + (random() - 0.5) * 0.14
    ), 4326)::geography AS coordinates,
    (category_pool.cat_ids)[1 + floor(random() * array_length(category_pool.cat_ids, 1))::int] AS category_id,
    ROUND((35.0 + random() * 60.0)::numeric, 2) AS accessibility_score,
    (ARRAY['verified', 'verified', 'verified', 'pending', 'unverified'])[1 + floor(random() * 5)::int]::verification_status AS verification_status,
    now() - (random() * interval '180 days') AS created_at
FROM city_centers c
CROSS JOIN category_pool
CROSS JOIN prefixes
CROSS JOIN place_types
CROSS JOIN streets
CROSS JOIN LATERAL generate_series(1, c.quota) AS i;

-- Generate matching accessibility_features for all locations
INSERT INTO public.accessibility_features (
    location_id,
    wheelchair_access,
    ramp_available,
    elevator_available,
    accessible_restroom,
    accessible_parking,
    stair_free_entry,
    door_accessible,
    verified,
    updated_at
)
SELECT 
    l.id,
    (random() > 0.35) AS wheelchair_access,
    (random() > 0.40) AS ramp_available,
    (random() > 0.50) AS elevator_available,
    (random() > 0.45) AS accessible_restroom,
    (random() > 0.40) AS accessible_parking,
    (random() > 0.35) AS stair_free_entry,
    (random() > 0.25) AS door_accessible,
    (l.verification_status = 'verified') AS verified,
    now()
FROM public.locations l
ON CONFLICT (location_id) DO NOTHING;

-- Generate 50,000+ Barrier Reports around the locations
WITH loc_sample AS (
    SELECT coordinates FROM public.locations TABLESAMPLE SYSTEM (50)
),
barrier_types AS (
    SELECT ARRAY['broken_footpath', 'missing_ramp', 'blocked_sidewalk', 'broken_elevator', 'unsafe_crossing']::barrier_category[] AS arr
),
status_types AS (
    SELECT ARRAY['pending', 'verified', 'verified', 'resolved']::barrier_status[] AS arr
),
descriptions AS (
    SELECT ARRAY[
        'Severe pothole and uneven paving blocking wheelchair transit on footpath.',
        'High curb without ramp cut making wheelchair transition impossible.',
        'Sidewalk completely blocked by construction scaffolding and materials.',
        'Elevator at transfer point is out of service with no alternate ramp.',
        'Crossing lacks curb ramp and acoustic pedestrian signal, unsafe for visual/mobility impaired.',
        'Broken tiles and missing drain cover creating hazardous gap.'
    ] AS arr
)
INSERT INTO public.barrier_reports (
    id,
    category,
    description,
    image_url,
    coordinates,
    status,
    created_at
)
SELECT 
    gen_random_uuid(),
    (barrier_types.arr)[1 + floor(random() * array_length(barrier_types.arr, 1))::int],
    (descriptions.arr)[1 + floor(random() * array_length(descriptions.arr, 1))::int] || ' [AccessPath Synthetic]',
    CASE WHEN random() > 0.5 THEN 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&q=80' ELSE NULL END,
    ST_SetSRID(ST_MakePoint(
        ST_X(coordinates::geometry) + (random() - 0.5) * 0.015,
        ST_Y(coordinates::geometry) + (random() - 0.5) * 0.015
    ), 4326)::geography,
    (status_types.arr)[1 + floor(random() * array_length(status_types.arr, 1))::int],
    now() - (random() * interval '120 days')
FROM loc_sample
CROSS JOIN barrier_types
CROSS JOIN status_types
CROSS JOIN descriptions
CROSS JOIN LATERAL generate_series(1, 12)
LIMIT 52000;

-- Generate 100,000+ Feedback Records
WITH loc_targets AS (
    SELECT id FROM public.locations
),
comments AS (
    SELECT ARRAY[
        'Smooth wide entrance with automated doors and well-graded ramp. Highly recommended.',
        'Wheelchair access is available via the side door, though the main entrance has steps.',
        'Restroom was spacious with sturdy grab bars. Staff was helpful.',
        'Elevator was functional and easily accommodated an electric wheelchair.',
        'Footpath leading up to the gate has minor cracks but generally passable.',
        'Elevator was down during my visit, had to take alternate route.',
        'Needs better signage from the parking area to the ramp entrance.'
    ] AS arr
)
INSERT INTO public.feedback (
    id,
    location_id,
    user_id,
    rating,
    comment,
    created_at
)
SELECT 
    gen_random_uuid(),
    l.id,
    '00000000-0000-0000-0000-000000000001'::uuid, -- Demo user placeholder
    floor(2 + random() * 4)::int,
    (comments.arr)[1 + floor(random() * array_length(comments.arr, 1))::int] || ' [AccessPath Synthetic]',
    now() - (random() * interval '90 days')
FROM loc_targets l
CROSS JOIN comments
CROSS JOIN LATERAL generate_series(1, 10)
LIMIT 105000;

-- Maintain full-text search vectors for newly seeded locations
UPDATE public.locations
SET search_vector =
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(address, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
WHERE description LIKE '%[AccessPath Synthetic]%';

COMMIT;
