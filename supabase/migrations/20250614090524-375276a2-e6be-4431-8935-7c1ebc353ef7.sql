
-- Add enum for board type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'board_type') THEN
    CREATE TYPE public.board_type AS ENUM ('day', 'full', 'weekly');
  END IF;
END$$;

-- Add column to system_users
ALTER TABLE public.system_users
ADD COLUMN IF NOT EXISTS board_type public.board_type;

-- (Optional) Set default for new students if needed:
-- ALTER TABLE public.system_users ALTER COLUMN board_type SET DEFAULT 'day';
