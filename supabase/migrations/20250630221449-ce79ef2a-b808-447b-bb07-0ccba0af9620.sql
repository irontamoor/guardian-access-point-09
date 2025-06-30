
-- Create enums for data types
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'student', 'parent', 'visitor', 'reader');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE attendance_status AS ENUM ('in', 'out');

-- System Users Table
CREATE TABLE system_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT UNIQUE,
  user_code TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  password TEXT,
  role user_role NOT NULL DEFAULT 'student',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index for user_code among active users only
CREATE UNIQUE INDEX system_users_user_code_active_unique_idx
  ON system_users(user_code)
  WHERE status = 'active';

-- Create index for fast lookups on user_code and status
CREATE INDEX system_users_user_code_status_idx
  ON system_users(user_code, status);

-- Attendance Records Table
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES system_users(id) ON DELETE CASCADE NOT NULL,
  status attendance_status NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  notes TEXT,
  company TEXT,
  host_name TEXT,
  purpose TEXT
);

-- Visitors Table
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- System Settings Table
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

-- Sign In Options Table
CREATE TABLE sign_in_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  applies_to TEXT NOT NULL DEFAULT 'both',
  category TEXT NOT NULL DEFAULT 'sign_in',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES system_users(id)
);

-- User Role Assignments Table (for role-based access control)
CREATE TABLE user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES system_users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Attendance Edits/Audit Log Table
CREATE TABLE attendance_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_record_id UUID REFERENCES attendance_records(id) ON DELETE CASCADE NOT NULL,
  admin_user_id UUID NOT NULL,
  old_status attendance_status,
  new_status attendance_status NOT NULL,
  edit_reason TEXT NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin user
INSERT INTO system_users (admin_id, password, first_name, last_name, role, status)
VALUES ('admin', 'admin123', 'Admin', 'User', 'admin', 'active');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
('dashboard_visibility', '{"showStudentCheckIn": true, "showStaffSignIn": true, "showVisitorRegistration": true, "showParentPickup": true}', 'Dashboard component visibility settings'),
('max_visitors_per_day', '100', 'Maximum visitors allowed per day');

-- Insert default sign-in options
INSERT INTO sign_in_options (label, applies_to, category, is_active) VALUES
('Meeting', 'both', 'visit_type', true),
('Delivery', 'both', 'visit_type', true),
('Interview', 'both', 'visit_type', true),
('Maintenance', 'both', 'visit_type', true),
('Parent Conference', 'both', 'visit_type', true),
('Event', 'both', 'visit_type', true);

-- Create indexes for better performance
CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_created_at ON attendance_records(created_at);
CREATE INDEX idx_visitors_created_at ON visitors(created_at);
CREATE INDEX idx_system_users_role ON system_users(role);
CREATE INDEX idx_system_users_status ON system_users(status);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_users_updated_at 
    BEFORE UPDATE ON system_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at 
    BEFORE UPDATE ON visitors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sign_in_options_updated_at 
    BEFORE UPDATE ON sign_in_options 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for public access (since this is a school VMS system)
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_in_options ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public access to system_users" ON system_users FOR ALL USING (true);
CREATE POLICY "Allow public access to attendance_records" ON attendance_records FOR ALL USING (true);
CREATE POLICY "Allow public access to visitors" ON visitors FOR ALL USING (true);
CREATE POLICY "Allow public access to system_settings" ON system_settings FOR ALL USING (true);
CREATE POLICY "Allow public access to sign_in_options" ON sign_in_options FOR ALL USING (true);
