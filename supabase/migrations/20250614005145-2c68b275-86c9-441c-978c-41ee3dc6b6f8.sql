
-- Insert a default admin user into the system_users table
INSERT INTO public.system_users (
  first_name, 
  last_name, 
  email, 
  role, 
  status,
  employee_id
) VALUES (
  'Admin',
  'User', 
  'admin@school.com',
  'admin',
  'active',
  'EMP001'
) ON CONFLICT (email) DO NOTHING;

-- Create the auth user with a simple password
-- Note: This will be handled by the application code since we can't directly insert into auth.users
