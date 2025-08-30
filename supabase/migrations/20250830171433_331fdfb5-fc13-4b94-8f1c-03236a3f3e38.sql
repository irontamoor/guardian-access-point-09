-- Create temporary compatibility table to prevent errors from cached queries
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for compatibility
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Add public access policy
CREATE POLICY "Allow public access to attendance_records" 
ON public.attendance_records 
FOR ALL 
USING (true);