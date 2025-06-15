
-- Table to store admin-configurable sign-in options (reasons/comments)

CREATE TABLE sign_in_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  -- staff, student, or both
  applies_to text NOT NULL DEFAULT 'both',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NULL REFERENCES system_users(id)
);

-- Enable Row Level Security (RLS) for future admin auth
ALTER TABLE sign_in_options ENABLE ROW LEVEL SECURITY;

-- Allow all for now (make more restrictive later if you want)
CREATE POLICY "Allow all access to sign_in_options"
  ON sign_in_options
  FOR ALL
  USING (true);

