
-- Remove the old policy for staff self-insert (since it relies on auth.uid())
DROP POLICY IF EXISTS "Staff can insert their attendance" ON public.attendance_records;

-- Allow attendance insert if referenced user is active staff
CREATE POLICY "Insert attendance for active staff" 
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.system_users
      WHERE system_users.id = attendance_records.user_id
        AND system_users.role = 'staff'
        AND system_users.status = 'active'
    )
  );

-- Keep the admin/reader insert for anyone, as before
-- (If it's already present, this will fail and that's fine)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = 'Admins & readers can insert attendance for anyone'
      AND tablename = 'attendance_records'
  ) THEN
    CREATE POLICY "Admins & readers can insert attendance for anyone"
      ON public.attendance_records
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.user_role_assignments
          WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
        )
      );
  END IF;
END$$;
