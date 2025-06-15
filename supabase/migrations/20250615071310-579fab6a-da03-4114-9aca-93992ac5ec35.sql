
-- 1. Add the user_code column (if not present)
ALTER TABLE public.system_users
  ADD COLUMN IF NOT EXISTS user_code TEXT;

-- 2. Add an index for fast lookups on user_code and status
CREATE INDEX IF NOT EXISTS system_users_user_code_status_idx
  ON public.system_users(user_code, status);

-- 3. Enforce uniqueness of user_code among 'active' users using a partial unique index
DROP INDEX IF EXISTS system_users_user_code_active_unique_idx;
CREATE UNIQUE INDEX system_users_user_code_active_unique_idx
  ON public.system_users(user_code)
  WHERE status = 'active';

-- 4. Optionally, update any code, migration, or UI that references 'id' for sign-in, to use 'user_code' instead.
-- This will be handled in the next step.
