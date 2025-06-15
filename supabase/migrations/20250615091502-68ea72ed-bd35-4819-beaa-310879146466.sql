
-- Re-add DEFAULT gen_random_uuid() to system_users.id so new users get automatically assigned IDs.
ALTER TABLE public.system_users ALTER COLUMN id SET DEFAULT gen_random_uuid();
