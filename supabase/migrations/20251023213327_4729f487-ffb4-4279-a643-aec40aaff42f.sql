-- Add photo columns to attendance tables
ALTER TABLE public.student_attendance 
ADD COLUMN check_in_photo_url text,
ADD COLUMN check_out_photo_url text;

ALTER TABLE public.staff_attendance 
ADD COLUMN check_in_photo_url text,
ADD COLUMN check_out_photo_url text;

ALTER TABLE public.visitor_records 
ADD COLUMN check_in_photo_url text,
ADD COLUMN check_out_photo_url text;

ALTER TABLE public.parent_pickup_records 
ADD COLUMN photo_url text;

-- Create storage bucket for attendance photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attendance-photos', 'attendance-photos', true);

-- Create RLS policies for attendance-photos bucket
CREATE POLICY "Anyone can upload attendance photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attendance-photos');

CREATE POLICY "Anyone can view attendance photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'attendance-photos');

CREATE POLICY "Anyone can update attendance photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'attendance-photos');