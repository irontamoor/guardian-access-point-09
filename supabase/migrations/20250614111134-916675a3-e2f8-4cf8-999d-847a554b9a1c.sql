
-- Step 1: Add 'reader' to the user_role enum (must run alone)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'reader';
