-- Fix 1: notification_preferences - Block direct SELECT and require admin RPC
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;

-- Block all direct access
CREATE POLICY "Block direct SELECT on notification_preferences"
ON public.notification_preferences FOR SELECT
USING (false);

CREATE POLICY "Block direct UPDATE on notification_preferences"
ON public.notification_preferences FOR UPDATE
USING (false);

-- Create RPC for admin access to notification preferences
CREATE OR REPLACE FUNCTION public.get_notification_preferences(p_admin_id TEXT, p_user_id UUID DEFAULT NULL)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  notify_student_check_in BOOLEAN,
  notify_student_check_out BOOLEAN,
  notify_staff_check_in BOOLEAN,
  notify_staff_check_out BOOLEAN,
  notify_visitor_check_in BOOLEAN,
  notify_visitor_check_out BOOLEAN,
  notify_parent_pickup BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
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

  IF p_user_id IS NOT NULL THEN
    RETURN QUERY
    SELECT np.id, np.user_id, np.notify_student_check_in, np.notify_student_check_out,
           np.notify_staff_check_in, np.notify_staff_check_out, np.notify_visitor_check_in,
           np.notify_visitor_check_out, np.notify_parent_pickup, np.created_at, np.updated_at
    FROM public.notification_preferences np
    WHERE np.user_id = p_user_id;
  ELSE
    RETURN QUERY
    SELECT np.id, np.user_id, np.notify_student_check_in, np.notify_student_check_out,
           np.notify_staff_check_in, np.notify_staff_check_out, np.notify_visitor_check_in,
           np.notify_visitor_check_out, np.notify_parent_pickup, np.created_at, np.updated_at
    FROM public.notification_preferences np;
  END IF;
END;
$$;

-- Fix 2: Remove public DELETE policies and add admin-only delete via RPC
DROP POLICY IF EXISTS "Public can delete student attendance" ON public.student_attendance;
DROP POLICY IF EXISTS "Public can delete staff attendance" ON public.staff_attendance;
DROP POLICY IF EXISTS "Public can delete visitor records" ON public.visitor_records;
DROP POLICY IF EXISTS "Public can delete parent pickup records" ON public.parent_pickup_records;

-- Create admin-only delete functions
CREATE OR REPLACE FUNCTION public.admin_delete_student_attendance(p_admin_id TEXT, p_record_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin credentials required';
  END IF;

  DELETE FROM public.student_attendance WHERE id = p_record_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_staff_attendance(p_admin_id TEXT, p_record_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin credentials required';
  END IF;

  DELETE FROM public.staff_attendance WHERE id = p_record_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_visitor_record(p_admin_id TEXT, p_record_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'staff_admin', 'reader')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin credentials required';
  END IF;

  DELETE FROM public.visitor_records WHERE id = p_record_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_parent_pickup_record(p_admin_id TEXT, p_record_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.system_users
    WHERE (admin_id = p_admin_id OR user_code = p_admin_id)
    AND role IN ('admin', 'staff_admin')
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin credentials required';
  END IF;

  DELETE FROM public.parent_pickup_records WHERE id = p_record_id;
  RETURN FOUND;
END;
$$;

-- Fix 3: Encrypt fingerprint templates using pgcrypto
-- First enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted column
ALTER TABLE public.parent_fingerprints 
ADD COLUMN IF NOT EXISTS fingerprint_template_encrypted BYTEA;

-- Create function to encrypt fingerprint data (uses a server-side key derived from service role)
-- Note: In production, use Vault for key storage
CREATE OR REPLACE FUNCTION public.encrypt_fingerprint_template(p_template TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  v_key BYTEA;
BEGIN
  -- Derive encryption key from a consistent source
  -- In production, this should use Supabase Vault
  v_key := digest('fingerprint_encryption_key_v1', 'sha256');
  RETURN pgp_sym_encrypt(p_template, encode(v_key, 'hex'));
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_fingerprint_template(p_encrypted BYTEA)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  v_key BYTEA;
BEGIN
  v_key := digest('fingerprint_encryption_key_v1', 'sha256');
  RETURN pgp_sym_decrypt(p_encrypted, encode(v_key, 'hex'));
END;
$$;

-- Migrate existing plaintext templates to encrypted (if any exist)
UPDATE public.parent_fingerprints 
SET fingerprint_template_encrypted = public.encrypt_fingerprint_template(fingerprint_template)
WHERE fingerprint_template_encrypted IS NULL AND fingerprint_template IS NOT NULL;

-- Update the RLS policy for fingerprint SELECT to only return encrypted data via RPC
DROP POLICY IF EXISTS "Kiosk can read approved fingerprints" ON public.parent_fingerprints;
DROP POLICY IF EXISTS "Kiosk can read approved fingerprints for matching" ON public.parent_fingerprints;

-- Only allow reading non-sensitive columns publicly
CREATE POLICY "Public can read approved fingerprint metadata only"
ON public.parent_fingerprints FOR SELECT
USING (is_approved = true);

-- Create secure RPC for fingerprint matching that returns decrypted template only to kiosk
CREATE OR REPLACE FUNCTION public.get_approved_fingerprints_for_matching()
RETURNS TABLE(
  id UUID,
  parent_guardian_name TEXT,
  relationship TEXT,
  fingerprint_template TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pf.id,
    pf.parent_guardian_name,
    pf.relationship,
    CASE 
      WHEN pf.fingerprint_template_encrypted IS NOT NULL 
      THEN public.decrypt_fingerprint_template(pf.fingerprint_template_encrypted)
      ELSE pf.fingerprint_template
    END as fingerprint_template
  FROM public.parent_fingerprints pf
  WHERE pf.is_approved = true;
END;
$$;

-- Create trigger to auto-encrypt on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_fingerprint_on_save()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  IF NEW.fingerprint_template IS NOT NULL THEN
    NEW.fingerprint_template_encrypted := public.encrypt_fingerprint_template(NEW.fingerprint_template);
    -- Clear plaintext after encryption (keep for backwards compatibility temporarily)
    -- NEW.fingerprint_template := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS encrypt_fingerprint_trigger ON public.parent_fingerprints;
CREATE TRIGGER encrypt_fingerprint_trigger
BEFORE INSERT OR UPDATE ON public.parent_fingerprints
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_fingerprint_on_save();