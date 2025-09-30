-- CRITICAL SECURITY FIX: Remove public access to sensitive tables
-- Since this app uses custom authentication, we remove public SELECT entirely
-- Data will be accessed through secure Edge Functions that validate admin credentials

-- Remove public SELECT policy from system_users
DROP POLICY IF EXISTS "Public can read user names and codes" ON public.system_users;

-- Remove public SELECT policy from visitor_records  
DROP POLICY IF EXISTS "Public can read visitor records" ON public.visitor_records;

-- Create a secure function that returns non-sensitive user data
-- This function can be called from Edge Functions with proper validation
CREATE OR REPLACE FUNCTION public.get_safe_user_data(
  p_admin_id TEXT,
  p_role TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  admin_id TEXT,
  user_code TEXT,
  first_name TEXT,
  last_name TEXT,
  role user_role,
  status user_status,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'reader')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Return safe user data (no passwords, emails, phones)
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
  FROM public.system_users su
  WHERE p_role IS NULL OR su.role = p_role::user_role;
END;
$$;

-- Create a secure function for visitor records
CREATE OR REPLACE FUNCTION public.get_visitor_records(
  p_admin_id TEXT,
  p_date TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  organization TEXT,
  visit_purpose TEXT,
  host_name TEXT,
  phone_number TEXT,
  status attendance_status,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'reader')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Return visitor records
  RETURN QUERY
  SELECT 
    vr.id,
    vr.first_name,
    vr.last_name,
    vr.organization,
    vr.visit_purpose,
    vr.host_name,
    vr.phone_number,
    vr.status,
    vr.check_in_time,
    vr.check_out_time,
    vr.notes,
    vr.created_at,
    vr.updated_at
  FROM public.visitor_records vr
  WHERE p_date IS NULL OR DATE(vr.created_at) = p_date::DATE
  ORDER BY vr.check_in_time DESC;
END;
$$;