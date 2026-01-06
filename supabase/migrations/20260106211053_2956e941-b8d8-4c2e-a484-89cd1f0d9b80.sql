-- Fix PUBLIC_DATA_EXPOSURE: Create secure RPC function for kiosk lookups
-- and restrict system_users SELECT policy

-- 1. Create RPC function for kiosk user validation (returns only essential fields)
CREATE OR REPLACE FUNCTION public.lookup_user_for_checkin(p_user_code TEXT)
RETURNS TABLE(
  id uuid,
  user_code TEXT, 
  first_name TEXT, 
  last_name TEXT, 
  role user_role,
  status user_status
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Validate input
  IF p_user_code IS NULL OR trim(p_user_code) = '' THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    su.id,
    su.user_code,
    su.first_name, 
    su.last_name, 
    su.role,
    su.status
  FROM system_users su
  WHERE su.user_code = trim(p_user_code)
    AND su.status = 'active'
  LIMIT 1;
END;
$$;

-- 2. Create RPC function for safe user data retrieval by admin
-- This is already handled by get_safe_user_data, but let's ensure it exists
CREATE OR REPLACE FUNCTION public.get_safe_user_data(p_admin_id TEXT, p_role TEXT DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  admin_id TEXT,
  user_code TEXT,
  first_name TEXT,
  last_name TEXT,
  role user_role,
  status user_status,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_admin_exists boolean;
BEGIN
  -- Verify the caller is an admin
  SELECT EXISTS (
    SELECT 1 FROM system_users 
    WHERE (system_users.admin_id = p_admin_id OR system_users.user_code = p_admin_id)
      AND system_users.role IN ('admin', 'staff_admin')
      AND system_users.status = 'active'
  ) INTO v_admin_exists;
  
  IF NOT v_admin_exists THEN
    RAISE EXCEPTION 'Unauthorized: Admin credentials required';
  END IF;
  
  -- Return filtered user data
  IF p_role IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      su.id,
      su.admin_id,
      su.user_code,
      su.first_name,
      su.last_name,
      su.role,
      su.status,
      su.created_at,
      su.updated_at
    FROM system_users su
    WHERE su.role::text = p_role
    ORDER BY su.created_at DESC;
  ELSE
    RETURN QUERY
    SELECT 
      su.id,
      su.admin_id,
      su.user_code,
      su.first_name,
      su.last_name,
      su.role,
      su.status,
      su.created_at,
      su.updated_at
    FROM system_users su
    ORDER BY su.created_at DESC;
  END IF;
END;
$$;

-- 3. Drop the overly permissive SELECT policy on system_users
DROP POLICY IF EXISTS "Enable read access for all users" ON system_users;

-- 4. Create new restrictive policy - block direct public SELECT
-- Users should use RPC functions instead
CREATE POLICY "Block direct public SELECT - use RPC functions" 
ON system_users 
FOR SELECT 
USING (false);

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.lookup_user_for_checkin(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_safe_user_data(TEXT, TEXT) TO anon, authenticated;