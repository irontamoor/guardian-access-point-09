-- Add DELETE policies for attendance tables to match existing public access pattern

-- Add DELETE policy for student_attendance
CREATE POLICY "Public can delete student attendance"
ON public.student_attendance
FOR DELETE
USING (true);

-- Add DELETE policy for staff_attendance  
CREATE POLICY "Public can delete staff attendance"
ON public.staff_attendance
FOR DELETE
USING (true);

-- Add DELETE policy for parent_pickup_records
CREATE POLICY "Public can delete parent pickup records"
ON public.parent_pickup_records
FOR DELETE
USING (true);