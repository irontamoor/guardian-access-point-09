
-- Remove the existing foreign key constraint that links attendance_records to system_users only
ALTER TABLE public.attendance_records DROP CONSTRAINT IF EXISTS attendance_records_user_id_fkey;

-- We'll keep the user_id column but remove the foreign key constraint
-- This allows the attendance system to track both system users and visitors
-- The application logic will handle the relationship appropriately
