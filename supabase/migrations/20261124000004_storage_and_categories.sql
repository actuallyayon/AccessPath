-- AccessPath Storage Buckets & Seed Categories

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('location-photos', 'location-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
    ('report-images', 'report-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Policies
CREATE POLICY "Public Read Location Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'location-photos');

CREATE POLICY "Authenticated Users Upload Location Photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'location-photos' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public Read Report Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-images');

CREATE POLICY "Authenticated Users Upload Barrier Report Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'report-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Seed Initial Required Categories
INSERT INTO public.categories (id, name, slug, icon)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Public Buildings', 'public-buildings', 'Building2'),
    ('c2222222-2222-2222-2222-222222222222', 'Parks & Recreation', 'parks-recreation', 'Trees'),
    ('c3333333-3333-3333-3333-333333333333', 'Educational Institutions', 'educational-institutions', 'GraduationCap'),
    ('c4444444-4444-4444-4444-444444444444', 'Transportation Facilities', 'transportation-facilities', 'Bus'),
    ('c5555555-5555-5555-5555-555555555555', 'Government Offices', 'government-offices', 'Landmark'),
    ('c6666666-6666-6666-6666-666666666666', 'Community Centers', 'community-centers', 'Users')
ON CONFLICT (slug) DO NOTHING;
