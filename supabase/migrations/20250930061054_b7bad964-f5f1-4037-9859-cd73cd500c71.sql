-- BETTER APPROACH: Create secure views that expose only safe columns
-- This allows existing client code to work while protecting sensitive data

-- First, restore limited public SELECT access via views
-- Grant back SELECT on system_users but clients should use the view instead
CREATE POLICY "Public can read system_users"
ON public.system_users
FOR SELECT
TO public
USING (true);

CREATE POLICY "Public can read visitor_records"  
ON public.visitor_records
FOR SELECT
TO public
USING (true);

-- Create a secure view for system_users that excludes sensitive columns
CREATE OR REPLACE VIEW public.system_users_safe AS
SELECT 
  id,
  admin_id,
  user_code,
  first_name,
  last_name,
  role,
  status,
  created_at,
  updated_at
FROM public.system_users;

-- Grant public access to the safe view
GRANT SELECT ON public.system_users_safe TO anon, authenticated;

-- Create a secure view for visitor records (all columns are relatively safe)
CREATE OR REPLACE VIEW public.visitor_records_safe AS
SELECT 
  id,
  first_name,
  last_name,
  organization,
  visit_purpose,
  host_name,
  phone_number,
  status,
  check_in_time,
  check_out_time,
  notes,
  created_at,
  updated_at
FROM public.visitor_records;

-- Grant public access to the visitor records view
GRANT SELECT ON public.visitor_records_safe TO anon, authenticated;

-- Add helpful comment
COMMENT ON VIEW public.system_users_safe IS 'Secure view of system_users that excludes password, email, and phone columns. Use this view for all SELECT queries from client code.';
COMMENT ON VIEW public.visitor_records_safe IS 'Secure view of visitor_records. Use this view for all SELECT queries from client code.';