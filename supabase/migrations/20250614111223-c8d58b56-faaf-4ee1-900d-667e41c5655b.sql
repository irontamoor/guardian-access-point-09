
-- Attendance records: allow SELECT for users with admin or reader roles
CREATE POLICY "Admins & readers can view all attendance_records"
  ON public.attendance_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
    )
  );

-- System users: allow SELECT for users with admin or reader roles
CREATE POLICY "Admins & readers can view all system_users"
  ON public.system_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
    )
  );

-- Ensure RLS is enabled (skip if already enabled)
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

-- (OPTIONAL: Uncomment and edit if you want readers/admins to see visitors - replace "visitors" with the correct table name)
-- CREATE POLICY "Admins & readers can view all visitors"
--   ON public.visitors
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.user_role_assignments
--       WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
--     )
--   );
-- ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
