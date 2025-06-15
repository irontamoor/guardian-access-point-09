
-- Step 1: Insert your user into system_users (if not present)
INSERT INTO public.system_users (id, first_name, last_name, email, role, status)
VALUES (
  '63e27389-a8ee-4bdb-8224-4d98965f2dd8',
  'tamoor', 'ahmed', 'admin@example.com', 'admin', 'active'
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Assign 'admin' role in user_role_assignments (if not present)
INSERT INTO public.user_role_assignments (user_id, role)
VALUES ('63e27389-a8ee-4bdb-8224-4d98965f2dd8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
