-- Add car_registration column to visitor_records table
ALTER TABLE public.visitor_records 
ADD COLUMN car_registration text;

-- Add comment for documentation
COMMENT ON COLUMN public.visitor_records.car_registration IS 'Optional vehicle registration/license plate number';