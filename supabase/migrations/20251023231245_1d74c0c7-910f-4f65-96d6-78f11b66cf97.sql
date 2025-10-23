CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

CREATE OR REPLACE FUNCTION public.verify_admin_credentials(
  p_admin_id text,
  p_password text
)
RETURNS TABLE(
  id uuid,
  admin_id text,
  user_code text,
  email text,
  phone text,
  role user_role,
  first_name text,
  last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
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
    AND su.password = crypt(p_password, su.password)
    AND su.role IN ('admin', 'reader', 'staff_admin')
    AND su.status = 'active'
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.hash_password()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.password IS NOT NULL AND NEW.password <> '' THEN
    IF NEW.password NOT LIKE '$2%' THEN
      NEW.password := crypt(NEW.password, gen_salt('bf', 10));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hash_password_trigger ON system_users;

CREATE TRIGGER hash_password_trigger
  BEFORE INSERT OR UPDATE OF password ON system_users
  FOR EACH ROW
  EXECUTE FUNCTION hash_password();

DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, password FROM system_users 
    WHERE password IS NOT NULL 
    AND password NOT LIKE '$2%'
  LOOP
    UPDATE system_users 
    SET password = crypt(user_record.password, gen_salt('bf', 10))
    WHERE id = user_record.id;
  END LOOP;
END;
$$;