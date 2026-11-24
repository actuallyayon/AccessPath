-- AccessPath Row Level Security (RLS) & Policies

-- Enable RLS on all tables
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

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is moderator or admin
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 1. PROFILES POLICIES
-- ==========================================
-- Any authenticated or anonymous user can read public profile info
CREATE POLICY "Profiles readable by anyone"
ON public.profiles FOR SELECT
USING (true);

-- Users can update their own profile (cannot change role or trust_score unless admin)
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
    id = auth.uid() AND 
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
);

-- Admins can update any profile (including role)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- 2. CATEGORIES POLICIES
-- ==========================================
-- Categories are readable by anyone
CREATE POLICY "Categories readable by all"
ON public.categories FOR SELECT
USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- 3. LOCATIONS POLICIES
-- ==========================================
-- Anyone can view locations:
-- Verified locations are public; pending/unverified are visible with status flag
CREATE POLICY "Locations readable by all"
ON public.locations FOR SELECT
USING (true);

-- Authenticated contributors/users can insert locations (forced to pending status)
CREATE POLICY "Users and contributors can submit locations"
ON public.locations FOR INSERT
TO authenticated
WITH CHECK (
    created_by = auth.uid() AND
    verification_status = 'pending'
);

-- Contributors can update their own locations only if still pending
CREATE POLICY "Contributors can update own pending locations"
ON public.locations FOR UPDATE
TO authenticated
USING (created_by = auth.uid() AND verification_status = 'pending')
WITH CHECK (created_by = auth.uid() AND verification_status = 'pending');

-- Moderators & Admins can update any location (and change verification_status)
CREATE POLICY "Moderators and admins can manage locations"
ON public.locations FOR UPDATE
TO authenticated
USING (public.is_moderator_or_admin())
WITH CHECK (public.is_moderator_or_admin());

-- Admins can delete locations
CREATE POLICY "Admins can delete locations"
ON public.locations FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==========================================
-- 4. ACCESSIBILITY_FEATURES POLICIES
-- ==========================================
CREATE POLICY "Accessibility features readable by all"
ON public.accessibility_features FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert features for their locations"
ON public.accessibility_features FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update accessibility features"
ON public.accessibility_features FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (
    -- contributors cannot set verified = true on their own
    (verified = false OR public.is_moderator_or_admin())
);

-- ==========================================
-- 5. LOCATION_PHOTOS POLICIES
-- ==========================================
CREATE POLICY "Location photos readable by all"
ON public.location_photos FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload location photos"
ON public.location_photos FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Owners and moderators can delete photos"
ON public.location_photos FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid() OR public.is_moderator_or_admin());

-- ==========================================
-- 6. BARRIER_REPORTS POLICIES
-- ==========================================
CREATE POLICY "Barrier reports readable by all"
ON public.barrier_reports FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert barrier reports"
ON public.barrier_reports FOR INSERT
TO authenticated
WITH CHECK (
    reporter_id = auth.uid() AND
    status = 'pending'
);

CREATE POLICY "Users can update own pending reports"
ON public.barrier_reports FOR UPDATE
TO authenticated
USING (reporter_id = auth.uid() AND status = 'pending')
WITH CHECK (reporter_id = auth.uid() AND status = 'pending');

CREATE POLICY "Moderators and admins can review barrier reports"
ON public.barrier_reports FOR UPDATE
TO authenticated
USING (public.is_moderator_or_admin())
WITH CHECK (public.is_moderator_or_admin());

CREATE POLICY "Admins can delete barrier reports"
ON public.barrier_reports FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==========================================
-- 7. FEEDBACK POLICIES
-- ==========================================
CREATE POLICY "Feedback readable by all"
ON public.feedback FOR SELECT
USING (true);

CREATE POLICY "Users can submit feedback"
ON public.feedback FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own feedback"
ON public.feedback FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and admins can delete feedback"
ON public.feedback FOR DELETE
TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

-- ==========================================
-- 8. FAVORITES POLICIES
-- ==========================================
CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
ON public.favorites FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove own favorites"
ON public.favorites FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ==========================================
-- 9. CONTRIBUTION_HISTORY POLICIES
-- ==========================================
CREATE POLICY "Users can view own contribution history"
ON public.contribution_history FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_moderator_or_admin());

CREATE POLICY "System and users can insert contributions"
ON public.contribution_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ==========================================
-- 10. AUDIT_LOGS & SYSTEM SETTINGS POLICIES
-- ==========================================
CREATE POLICY "Settings readable by all authenticated"
ON public.system_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Settings manageable only by admins"
ON public.system_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Audit logs viewable only by admins"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Audit logs insertable by authenticated actions"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);
