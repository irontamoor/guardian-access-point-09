-- Add staff_admin to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'staff_admin';

-- Update verify_admin_credentials to allow only admin, reader, and staff_admin
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_admin_id text, p_password text)
RETURNS TABLE(id uuid, admin_id text, user_code text, email text, phone text, role user_role, first_name text, last_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Allow only admin, reader, and staff_admin roles to access the admin backend
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
    AND su.role IN ('admin', 'reader', 'staff_admin')
    AND su.status = 'active'
  LIMIT 1;
END;
$$;

-- Update get_safe_user_data to allow only admin, reader, and staff_admin
CREATE OR REPLACE FUNCTION public.get_safe_user_data(p_admin_id text, p_role text DEFAULT NULL::text)
RETURNS TABLE(id uuid, admin_id text, user_code text, first_name text, last_name text, role user_role, status user_status, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Verify the caller is an admin, reader, or staff_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'reader', 'staff_admin')
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

-- Update get_visitor_records to allow only admin, reader, and staff_admin
CREATE OR REPLACE FUNCTION public.get_visitor_records(p_admin_id text, p_date text DEFAULT NULL::text)
RETURNS TABLE(id uuid, first_name text, last_name text, organization text, visit_purpose text, host_name text, phone_number text, status attendance_status, check_in_time timestamp with time zone, check_out_time timestamp with time zone, notes text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  -- Verify the caller is an admin, reader, or staff_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'reader', 'staff_admin')
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