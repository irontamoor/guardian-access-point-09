
-- Remove employee_id and student_id columns from system_users table
ALTER TABLE public.system_users
  DROP COLUMN IF EXISTS employee_id,
  DROP COLUMN IF EXISTS student_id;
