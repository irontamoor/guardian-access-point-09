
-- 1. Find the admin user's ID
WITH admin_user AS (
  SELECT id FROM public.system_users WHERE email = 'admin@admin.com'
)
-- 2. Assign the admin role if not already assigned
INSERT INTO public.user_role_assignments (user_id, role)
SELECT id, 'admin' FROM admin_user
ON CONFLICT (user_id, role) DO NOTHING;
