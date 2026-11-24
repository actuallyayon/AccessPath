-- AccessPath Initial Migration: Extensions, Tables, Triggers & RLS
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Custom ENUM Types
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

-- 1. PROFILES Table
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

-- 2. CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT 'MapPin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. LOCATIONS Table
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

-- 4. ACCESSIBILITY_FEATURES Table
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

-- 5. LOCATION_PHOTOS Table
CREATE TABLE IF NOT EXISTS public.location_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. BARRIER_REPORTS Table
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

-- 7. FEEDBACK Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. FAVORITES Table
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, location_id)
);

-- 9. CONTRIBUTION_HISTORY Table
CREATE TABLE IF NOT EXISTS public.contribution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'location', 'barrier_report', 'feedback', 'accessibility_features'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'verified', 'rejected'
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. AUDIT_LOG & SYSTEM_SETTINGS Tables
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

-- INDEXES
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
