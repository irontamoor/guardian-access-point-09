
-- Allow attendance insert if referenced user is an active student (code-based unattended sign in/out)
CREATE POLICY "Insert attendance for active students"
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.system_users
      WHERE system_users.id = attendance_records.user_id
        AND system_users.role = 'student'
        AND system_users.status = 'active'
    )
  );
