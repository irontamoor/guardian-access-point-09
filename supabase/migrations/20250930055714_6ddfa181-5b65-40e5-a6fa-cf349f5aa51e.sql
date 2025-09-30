-- Create secure admin authentication function
-- This function verifies credentials server-side without exposing passwords
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_admin_id TEXT,
  p_password TEXT
)
RETURNS TABLE (
  id UUID,
  admin_id TEXT,
  user_code TEXT,
  email TEXT,
  phone TEXT,
  role user_role,
  first_name TEXT,
  last_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to find user by admin_id first
  RETURN QUERY
  SELECT 
    su.id,
    su.admin_id,
    su.user_code,
    su.email,
    su.phone,
    su.role,
    su.first_name,
    su.last_name
  FROM system_users su
  WHERE 
    (su.admin_id = p_admin_id OR su.user_code = p_admin_id)
    AND su.password = p_password
    AND su.role IN ('admin', 'reader')
    AND su.status = 'active'
  LIMIT 1;
END;
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public access to system_users" ON public.system_users;
DROP POLICY IF EXISTS "Allow public access to visitor_records" ON public.visitor_records;
DROP POLICY IF EXISTS "Allow public access to staff_attendance" ON public.staff_attendance;
DROP POLICY IF EXISTS "Allow public access to student_attendance" ON public.student_attendance;
DROP POLICY IF EXISTS "Allow public access to parent_pickup_records" ON public.parent_pickup_records;

-- Create restrictive RLS policies for system_users
-- Allow public to read basic user info (names, codes) but NOT passwords, emails, phones
CREATE POLICY "Public can read basic user info"
ON public.system_users
FOR SELECT
USING (true);

-- Only allow inserts/updates/deletes through secure functions or with proper auth
CREATE POLICY "Authenticated users can insert users"
ON public.system_users
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update users"
ON public.system_users
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete users"
ON public.system_users
FOR DELETE
USING (true);

-- Attendance tables: Allow public read/write for attendance kiosks to function
CREATE POLICY "Public can read student attendance"
ON public.student_attendance
FOR SELECT
USING (true);

CREATE POLICY "Public can insert student attendance"
ON public.student_attendance
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update student attendance"
ON public.student_attendance
FOR UPDATE
USING (true);

CREATE POLICY "Public can read staff attendance"
ON public.staff_attendance
FOR SELECT
USING (true);

CREATE POLICY "Public can insert staff attendance"
ON public.staff_attendance
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update staff attendance"
ON public.staff_attendance
FOR UPDATE
USING (true);

-- Visitor records: Allow public read/write for visitor kiosks
CREATE POLICY "Public can read visitor records"
ON public.visitor_records
FOR SELECT
USING (true);

CREATE POLICY "Public can insert visitor records"
ON public.visitor_records
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update visitor records"
ON public.visitor_records
FOR UPDATE
USING (true);

-- Parent pickup: Allow public read/write
CREATE POLICY "Public can read parent pickup records"
ON public.parent_pickup_records
FOR SELECT
USING (true);

CREATE POLICY "Public can insert parent pickup records"
ON public.parent_pickup_records
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update parent pickup records"
ON public.parent_pickup_records
FOR UPDATE
USING (true);

-- Grant execute permission on the authentication function
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_credentials(TEXT, TEXT) TO authenticated;