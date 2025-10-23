-- Make attendance-photos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'attendance-photos';

-- Create function to check if user is a backend admin
CREATE OR REPLACE FUNCTION public.is_backend_user(_user_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.system_users
    WHERE (admin_id = _user_id OR user_code = _user_id)
    AND role IN ('admin', 'reader', 'staff_admin')
    AND status = 'active'
  )
$$;

-- Create RLS policies for storage.objects to restrict photo access
CREATE POLICY "Backend users can view attendance photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'attendance-photos' 
  AND public.is_backend_user(auth.jwt() ->> 'user_code')
);

CREATE POLICY "Allow uploads to attendance-photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'attendance-photos'
);

CREATE POLICY "Allow updates to attendance-photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'attendance-photos');