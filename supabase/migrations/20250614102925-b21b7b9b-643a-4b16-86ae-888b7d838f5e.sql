
-- Remove the board_type column from system_users
ALTER TABLE public.system_users DROP COLUMN IF EXISTS board_type;

-- Make phone field optional (if not already, cleanup: ensure nullable)
ALTER TABLE public.system_users ALTER COLUMN phone DROP NOT NULL;
