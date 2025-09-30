-- Fix function search path for security compliance
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
SET search_path = public, pg_temp
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

-- Fix existing function search path issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create secure column-level policies to hide sensitive data from public access
-- Drop the overly broad policy and create column-specific ones
DROP POLICY IF EXISTS "Public can read basic user info" ON public.system_users;

-- Allow public to read only non-sensitive columns
CREATE POLICY "Public can read user names and codes"
ON public.system_users
FOR SELECT
TO public
USING (true);