
-- Step 1: Delete from user_role_assignments, user_roles, and system_users except for login@login.com
DELETE FROM public.user_role_assignments
WHERE user_id IN (
    SELECT id FROM public.system_users WHERE email IS DISTINCT FROM 'login@login.com'
);

DELETE FROM public.user_roles
WHERE user_id IN (
    SELECT id FROM public.system_users WHERE email IS DISTINCT FROM 'login@login.com'
);

DELETE FROM public.system_users
WHERE email IS DISTINCT FROM 'login@login.com';

-- Step 2: Add the admin user if not already present
INSERT INTO public.system_users (first_name, last_name, email, role, status)
SELECT 'Login', 'User', 'login@login.com', 'admin', 'active'
WHERE NOT EXISTS (
    SELECT 1 FROM public.system_users WHERE email = 'login@login.com'
);

-- Step 3: Ensure admin role is granted in both role assignment tables
DO $$
DECLARE
  _user_id uuid;
BEGIN
  SELECT id INTO _user_id FROM public.system_users WHERE email = 'login@login.com';
  IF _user_id IS NOT NULL THEN
    -- user_role_assignments
    IF NOT EXISTS (
      SELECT 1 FROM public.user_role_assignments WHERE user_id = _user_id AND role = 'admin'
    ) THEN
      INSERT INTO public.user_role_assignments (user_id, role)
      VALUES (_user_id, 'admin');
    END IF;
    -- user_roles (app_role)
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
    ) THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (_user_id, 'admin');
    END IF;
  END IF;
END$$;
