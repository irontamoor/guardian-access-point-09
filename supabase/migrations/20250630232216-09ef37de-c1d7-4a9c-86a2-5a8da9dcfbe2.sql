
-- Add new columns to attendance_records to store visitor information
ALTER TABLE public.attendance_records 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN organization TEXT,
ADD COLUMN visit_purpose TEXT,
ADD COLUMN phone_number TEXT;

-- Migrate existing visitor data from visitors table to attendance_records
UPDATE public.attendance_records 
SET 
  first_name = v.first_name,
  last_name = v.last_name,
  organization = v.organization,
  visit_purpose = v.visit_purpose,
  phone_number = v.phone_number
FROM public.visitors v
WHERE attendance_records.user_id = v.id;

-- Migrate existing system user data to attendance_records for completeness
UPDATE public.attendance_records 
SET 
  first_name = COALESCE(attendance_records.first_name, su.first_name),
  last_name = COALESCE(attendance_records.last_name, su.last_name)
FROM public.system_users su
WHERE attendance_records.user_id = su.id;

-- Drop the visitors table since data is now in attendance_records
DROP TABLE public.visitors;

-- Drop the system_settings, user_role_assignments, and sign_in_options tables
-- since they will be moved to JSON files
DROP TABLE public.system_settings;
DROP TABLE public.user_role_assignments;
DROP TABLE public.sign_in_options;
