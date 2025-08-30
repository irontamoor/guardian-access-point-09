-- Add approved column to parent_pickup_records table
ALTER TABLE public.parent_pickup_records 
ADD COLUMN approved BOOLEAN NOT NULL DEFAULT false;

-- Add index for performance on approved queries
CREATE INDEX idx_parent_pickup_records_approved ON public.parent_pickup_records(approved);

-- Update existing records to have approved = false (already default, but explicit)
UPDATE public.parent_pickup_records SET approved = false WHERE approved IS NULL;