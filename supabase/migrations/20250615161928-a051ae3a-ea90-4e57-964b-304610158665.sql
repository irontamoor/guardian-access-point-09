
-- Assign the current user an 'admin' role so they can see attendance records

-- Replace YOUR_USER_UUID_HERE with the UUID of your user (from auth.users or system_users)
-- (You can get your UUID from Supabase dashboard > Authentication > Users, or from your session object)

INSERT INTO public.user_role_assignments (user_id, role)
SELECT id, 'admin'
FROM public.system_users
WHERE email = 'your@email.com'  -- <-- CHANGE this to your actual email
ON CONFLICT DO NOTHING;

-- If your user already exists in the auth.users table but not in system_users, manually match the correct user_id.
-- This will allow your user to pass RLS checks and see all attendance records.
