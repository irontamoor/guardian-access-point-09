
// Database types for PostgreSQL
export type AttendanceStatus = 'in' | 'out';
export type UserRole = 'admin' | 'staff' | 'student' | 'parent' | 'visitor' | 'reader';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface SystemUser {
  id: string;
  admin_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  user_code?: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  created_by?: string;
  notes?: string;
  company?: string;
  host_name?: string;
  purpose?: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  organization?: string;
  visit_purpose: string;
  host_name?: string;
  phone_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value?: any;
  description?: string;
  updated_at: string;
  updated_by?: string;
}

export interface SignInOption {
  id: string;
  label: string;
  applies_to: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}
