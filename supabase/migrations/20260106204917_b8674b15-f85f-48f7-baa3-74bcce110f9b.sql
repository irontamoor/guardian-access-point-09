-- Drop existing overly permissive policies on parent_fingerprints
DROP POLICY IF EXISTS "Public can read fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Public can insert fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Public can update fingerprints" ON parent_fingerprints;
DROP POLICY IF EXISTS "Public can delete fingerprints" ON parent_fingerprints;

-- Create tighter policies for fingerprint data
-- Allow public INSERT for registration (kiosk needs this)
CREATE POLICY "Kiosk can register fingerprints" 
ON parent_fingerprints 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading APPROVED fingerprints for matching (kiosk verification)
CREATE POLICY "Kiosk can read approved fingerprints for matching" 
ON parent_fingerprints 
FOR SELECT 
USING (is_approved = true);

-- Admin can read ALL fingerprints (including pending approval)
CREATE POLICY "Admin can read all fingerprints" 
ON parent_fingerprints 
FOR SELECT 
USING (
  public.is_backend_user(current_setting('request.jwt.claims', true)::json->>'user_code')
);

-- Only admin can update fingerprints (approve/reject)
CREATE POLICY "Admin can update fingerprints" 
ON parent_fingerprints 
FOR UPDATE 
USING (
  public.is_backend_user(current_setting('request.jwt.claims', true)::json->>'user_code')
);

-- Only admin can delete fingerprints
CREATE POLICY "Admin can delete fingerprints" 
ON parent_fingerprints 
FOR DELETE 
USING (
  public.is_backend_user(current_setting('request.jwt.claims', true)::json->>'user_code')
);

-- Drop existing policies on parent_student_links
DROP POLICY IF EXISTS "Public can read links" ON parent_student_links;
DROP POLICY IF EXISTS "Public can insert links" ON parent_student_links;
DROP POLICY IF EXISTS "Public can delete links" ON parent_student_links;

-- Create tighter policies for parent_student_links
-- Allow public INSERT (registration needs this)
CREATE POLICY "Kiosk can create student links" 
ON parent_student_links 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading links for approved fingerprints
CREATE POLICY "Kiosk can read links for approved fingerprints" 
ON parent_student_links 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM parent_fingerprints pf 
    WHERE pf.id = parent_student_links.parent_fingerprint_id 
    AND pf.is_approved = true
  )
);

-- Admin can read all links
CREATE POLICY "Admin can read all student links" 
ON parent_student_links 
FOR SELECT 
USING (
  public.is_backend_user(current_setting('request.jwt.claims', true)::json->>'user_code')
);

-- Only admin can delete links
CREATE POLICY "Admin can delete student links" 
ON parent_student_links 
FOR DELETE 
USING (
  public.is_backend_user(current_setting('request.jwt.claims', true)::json->>'user_code')
);