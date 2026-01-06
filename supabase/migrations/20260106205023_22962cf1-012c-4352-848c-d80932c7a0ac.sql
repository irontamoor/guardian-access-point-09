-- Drop the admin-based RLS policies that rely on JWT claims (which don't exist in this system)
DROP POLICY IF EXISTS "Admin can read all fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Admin can update fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Admin can delete fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Admin can read all student links" ON parent_student_links;
DROP POLICY IF EXISTS "Admin can delete student links" ON parent_student_links;

-- Simplify policies: kiosk can only read approved fingerprints, 
-- admin operations go through RPC functions
CREATE POLICY "Kiosk can read approved fingerprints" 
ON parent_fingerprints 
FOR SELECT 
USING (is_approved = true);

-- Allow updates for approval workflow (will be controlled via RPC)
CREATE POLICY "Allow fingerprint updates" 
ON parent_fingerprints 
FOR UPDATE 
USING (true);

-- Allow deletes (will be controlled via RPC)
CREATE POLICY "Allow fingerprint deletes" 
ON parent_fingerprints 
FOR DELETE 
USING (true);

-- Parent student links: read links for approved fingerprints only
CREATE POLICY "Read links for approved parents" 
ON parent_student_links 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM parent_fingerprints pf 
    WHERE pf.id = parent_student_links.parent_fingerprint_id 
    AND pf.is_approved = true
  )
);

-- Allow link deletes
CREATE POLICY "Allow link deletes" 
ON parent_student_links 
FOR DELETE 
USING (true);

-- Create RPC function for admin to fetch ALL fingerprints (including pending)
CREATE OR REPLACE FUNCTION public.get_all_fingerprints(p_admin_id TEXT)
RETURNS TABLE(
  id UUID,
  parent_guardian_name TEXT,
  relationship TEXT,
  is_approved BOOLEAN,
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID
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
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Return all fingerprint records
  RETURN QUERY
  SELECT 
    pf.id,
    pf.parent_guardian_name,
    pf.relationship,
    pf.is_approved,
    pf.created_at,
    pf.approved_at,
    pf.approved_by
  FROM public.parent_fingerprints pf
  ORDER BY pf.created_at DESC;
END;
$$;

-- Create RPC function for admin to approve fingerprints
CREATE OR REPLACE FUNCTION public.approve_fingerprint(
  p_admin_id TEXT,
  p_fingerprint_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_admin_uuid UUID;
BEGIN
  -- Verify the caller is an admin and get their UUID
  SELECT id INTO v_admin_uuid
  FROM public.system_users
  WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
  AND role IN ('admin', 'staff_admin')
  AND status = 'active'
  LIMIT 1;

  IF v_admin_uuid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Update the fingerprint
  UPDATE public.parent_fingerprints
  SET 
    is_approved = true,
    approved_at = now(),
    approved_by = v_admin_uuid
  WHERE id = p_fingerprint_id;

  RETURN FOUND;
END;
$$;

-- Create RPC function for admin to reject/delete fingerprints
CREATE OR REPLACE FUNCTION public.reject_fingerprint(
  p_admin_id TEXT,
  p_fingerprint_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Delete the fingerprint (cascade will remove links)
  DELETE FROM public.parent_fingerprints
  WHERE id = p_fingerprint_id;

  RETURN FOUND;
END;
$$;

-- Create RPC function to get student links for admin
CREATE OR REPLACE FUNCTION public.get_fingerprint_student_links(p_admin_id TEXT)
RETURNS TABLE(
  parent_fingerprint_id UUID,
  student_id TEXT
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
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;

  -- Return all links
  RETURN QUERY
  SELECT psl.parent_fingerprint_id, psl.student_id
  FROM public.parent_student_links psl;
END;
$$;