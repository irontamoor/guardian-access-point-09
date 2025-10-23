-- Create enum type for pickup status
CREATE TYPE pickup_status_enum AS ENUM (
  'pending_approval',
  'getting_ready', 
  'approved_to_leave',
  'issue_call_supervisor'
);

-- Add new column to parent_pickup_records
ALTER TABLE parent_pickup_records 
ADD COLUMN pickup_status pickup_status_enum DEFAULT 'pending_approval';

-- Migrate existing data based on approved boolean
UPDATE parent_pickup_records 
SET pickup_status = CASE 
  WHEN approved = true THEN 'approved_to_leave'::pickup_status_enum
  ELSE 'pending_approval'::pickup_status_enum
END;

-- Add index for better query performance
CREATE INDEX idx_parent_pickup_records_status ON parent_pickup_records(pickup_status);