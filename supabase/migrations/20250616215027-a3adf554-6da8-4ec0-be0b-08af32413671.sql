
-- Drop the existing policies that check user_role_assignments
DROP POLICY IF EXISTS "Admins can view system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can insert system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system_settings" ON public.system_settings;

-- Create new policies that allow anyone to access system_settings (since your app handles admin auth at the application level)
CREATE POLICY "Anyone can view system_settings"
  ON public.system_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert system_settings"
  ON public.system_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update system_settings"
  ON public.system_settings
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete system_settings"
  ON public.system_settings
  FOR DELETE
  USING (true);
