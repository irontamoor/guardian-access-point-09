
-- Remove DEFAULT gen_random_uuid() from system_users.id so it must always be provided
ALTER TABLE public.system_users ALTER COLUMN id DROP DEFAULT;
