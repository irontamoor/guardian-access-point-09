-- Create table for storing parent fingerprint data
CREATE TABLE parent_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_guardian_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  fingerprint_template TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES system_users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE parent_fingerprints ENABLE ROW LEVEL SECURITY;

-- RLS policies for public access (kiosk usage)
CREATE POLICY "Public can read fingerprints" ON parent_fingerprints FOR SELECT USING (true);
CREATE POLICY "Public can insert fingerprints" ON parent_fingerprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update fingerprints" ON parent_fingerprints FOR UPDATE USING (true);
CREATE POLICY "Public can delete fingerprints" ON parent_fingerprints FOR DELETE USING (true);

-- Create linking table for parent-student relationships
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_fingerprint_id UUID REFERENCES parent_fingerprints(id) ON DELETE CASCADE NOT NULL,
  student_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public can read links" ON parent_student_links FOR SELECT USING (true);
CREATE POLICY "Public can insert links" ON parent_student_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete links" ON parent_student_links FOR DELETE USING (true);

-- Add updated_at trigger for parent_fingerprints
CREATE TRIGGER update_parent_fingerprints_updated_at
  BEFORE UPDATE ON parent_fingerprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();