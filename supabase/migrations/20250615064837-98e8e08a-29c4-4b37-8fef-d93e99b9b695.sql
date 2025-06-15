
-- Add extra fields to store visitor-specific information per attendance event
ALTER TABLE public.attendance_records
  ADD COLUMN company TEXT,
  ADD COLUMN host_name TEXT,
  ADD COLUMN purpose TEXT;

-- No changes are needed for staff/student: validation and attendance are fine as-is.
