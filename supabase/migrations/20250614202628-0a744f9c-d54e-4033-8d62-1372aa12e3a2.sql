
-- 1. Remove existing restrictive policies on user_role_assignments if any
DROP POLICY IF EXISTS "Admins can view role assignments" ON public.user_role_assignments;
DROP POLICY IF EXISTS "Admins can manage role assignments" ON public.user_role_assignments;

-- 2. Allow anyone (even unauthenticated) to select, insert, and delete user_role_assignments (for development/testing only)
CREATE POLICY "Anyone can select role assignments"
  ON public.user_role_assignments
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert role assignments"
  ON public.user_role_assignments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete role assignments"
  ON public.user_role_assignments
  FOR DELETE
  USING (true);

-- After testing, you should restore secure admin-only policies for this table!
