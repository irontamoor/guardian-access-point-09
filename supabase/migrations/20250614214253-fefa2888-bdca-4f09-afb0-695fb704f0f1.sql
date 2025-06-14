
-- 1. Add an admin_id (login username) column
ALTER TABLE public.system_users
    ADD COLUMN IF NOT EXISTS admin_id TEXT UNIQUE;

-- 2. Add a password column (if it doesn't exist)
ALTER TABLE public.system_users
    ADD COLUMN IF NOT EXISTS password TEXT;

-- 3. Insert or update an admin record (replace YOUR_UUID with a real uuid if desired, or let default generate)
INSERT INTO public.system_users (admin_id, password, first_name, last_name, role, status)
VALUES ('admin', 'admin123', 'Admin', 'User', 'admin', 'active')
ON CONFLICT (admin_id) DO UPDATE 
SET password = EXCLUDED.password,
    role = 'admin',
    status = 'active';
