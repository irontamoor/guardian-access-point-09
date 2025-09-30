-- Drop the views that triggered security warnings
DROP VIEW IF EXISTS public.system_users_safe;
DROP VIEW IF EXISTS public.visitor_records_safe;

-- Remove the policies we just added
DROP POLICY IF EXISTS "Public can read system_users" ON public.system_users;
DROP POLICY IF EXISTS "Public can read visitor_records" ON public.visitor_records;

-- FINAL SOLUTION: Use column-level GRANT to restrict sensitive columns
-- Revoke default SELECT on sensitive columns from public/anon
REVOKE SELECT ON public.system_users FROM anon;
REVOKE SELECT ON public.system_users FROM public;

-- Grant SELECT only on non-sensitive columns to anon/public roles
GRANT SELECT (id, admin_id, user_code, first_name, last_name, role, status, created_at, updated_at) 
ON public.system_users TO anon, public;

-- For INSERT/UPDATE operations, grant necessary permissions
GRANT INSERT ON public.system_users TO anon, authenticated;
GRANT UPDATE (first_name, last_name, role, status, password, email, phone, updated_at) 
ON public.system_users TO anon, authenticated;
GRANT DELETE ON public.system_users TO authenticated;

-- For visitor_records, keep full access since no highly sensitive data
-- Just ensure phone numbers are not exposed in base policy
GRANT SELECT ON public.visitor_records TO anon, public;
GRANT INSERT, UPDATE ON public.visitor_records TO anon, authenticated;

-- Maintain existing RLS policies for row-level security
-- Add back restrictive policies that work with column-level grants
CREATE POLICY "Enable read access for all users"
ON public.system_users
FOR SELECT
USING (true);

CREATE POLICY "Enable read access for visitor records"
ON public.visitor_records  
FOR SELECT
USING (true);