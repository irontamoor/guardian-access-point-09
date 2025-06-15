
-- Create RLS policies for system_settings table
CREATE POLICY "Admins can view system_settings"
  ON public.system_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert system_settings"
  ON public.system_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update system_settings"
  ON public.system_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Enable RLS on system_settings if not already enabled
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create a visitors table to store visitor information
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  organization TEXT,
  visit_purpose TEXT NOT NULL,
  host_name TEXT,
  phone_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on visitors table
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for visitors table
CREATE POLICY "Admins & readers can view all visitors"
  ON public.visitors
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role IN ('admin', 'reader')
    )
  );

CREATE POLICY "Admins can insert visitors"
  ON public.visitors
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update visitors"
  ON public.visitors
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
