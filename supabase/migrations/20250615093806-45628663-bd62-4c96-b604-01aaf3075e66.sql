
-- Allow staff to insert their attendance
CREATE POLICY "Staff can insert their attendance"
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.system_users
      WHERE id = auth.uid()
        AND role = 'staff'
        AND status = 'active'
    )
    AND user_id = auth.uid()
  );

-- Allow admins & readers to insert attendance for anyone
CREATE POLICY "Admins & readers can insert attendance for anyone"
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
    )
  );
