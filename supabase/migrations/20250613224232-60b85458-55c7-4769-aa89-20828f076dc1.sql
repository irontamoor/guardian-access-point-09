
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'staff', 'student', 'parent', 'visitor');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('in', 'out');

-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create users table for managing all system users
CREATE TABLE public.system_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE,
  student_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'student',
  status public.user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
  status public.attendance_status NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Create attendance edits/audit log table
CREATE TABLE public.attendance_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attendance_record_id UUID REFERENCES public.attendance_records(id) ON DELETE CASCADE NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  old_status public.attendance_status,
  new_status public.attendance_status NOT NULL,
  edit_reason TEXT NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create user roles assignment table
CREATE TABLE public.user_role_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.system_users(id) ON DELETE CASCADE NOT NULL,
  role public.user_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_role_assignments ura
    JOIN public.system_users su ON ura.user_id = su.id
    WHERE su.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND ura.role = 'admin'
  );
$$;

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all users" ON public.system_users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert users" ON public.system_users
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update users" ON public.system_users
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete users" ON public.system_users
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can view all attendance" ON public.attendance_records
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert attendance" ON public.attendance_records
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update attendance" ON public.attendance_records
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can view attendance edits" ON public.attendance_edits
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert attendance edits" ON public.attendance_edits
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view system settings" ON public.system_settings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can modify system settings" ON public.system_settings
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view role assignments" ON public.user_role_assignments
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage role assignments" ON public.user_role_assignments
  FOR ALL USING (public.is_admin());

-- Insert default admin user (you'll need to update the email to match your auth user)
INSERT INTO public.system_users (first_name, last_name, email, role, employee_id)
VALUES ('Admin', 'User', 'admin@example.com', 'admin', 'ADMIN001');

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES 
('database_connection', '{"host": "", "port": "", "database": "", "username": ""}', 'Database connection settings'),
('school_name', '"School VMS"', 'School name setting'),
('max_visitors_per_day', '100', 'Maximum visitors allowed per day'),
('auto_signout_hours', '8', 'Automatic sign-out after hours');
