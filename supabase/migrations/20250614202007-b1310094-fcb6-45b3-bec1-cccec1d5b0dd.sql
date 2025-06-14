
-- Temporarily relax RLS for `system_users` to allow anyone to insert, update, and select users.

-- 1. Remove existing restrictive policies if needed
DROP POLICY IF EXISTS "Admins can view all users" ON public.system_users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.system_users;
DROP POLICY IF EXISTS "Admins can update users" ON public.system_users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.system_users;

-- 2. Allow anyone (even unauthenticated) to select, insert, and update users
CREATE POLICY "Anyone can select users"
  ON public.system_users
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert users"
  ON public.system_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update users"
  ON public.system_users
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete users"
  ON public.system_users
  FOR DELETE
  USING (true);

-- After testing, you should restore secure admin-only policies.
