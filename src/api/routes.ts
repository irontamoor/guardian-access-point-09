import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

export class VMSApi {
  // Users API - uses RPC function for secure access
  static async getUsers(role?: string, adminId?: string) {
    // If adminId provided, use secure RPC function
    if (adminId) {
      const { data, error } = await supabase
        .rpc('get_safe_user_data', { 
          p_admin_id: adminId, 
          p_role: role || null 
        });
      
      if (error) throw error;
      return data || [];
    }
    
    // For public kiosk access, use dedicated tables
    if (role === 'student') {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, status, created_at, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        user_code: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'student',
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at
      }));
    }
    
    if (role === 'staff') {
      const { data, error } = await supabase
        .from('staff')
        .select('id, employee_id, first_name, last_name, status, created_at, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        user_code: s.employee_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'staff',
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at
      }));
    }
    
    // For other roles without adminId, return empty (requires admin access)
    return [];
  }

  static async createUser(userData: any) {
    const { data, error } = await supabase
      .from('system_users')
      .insert({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        user_code: userData.user_code
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUser(id: string, userData: any) {
    const { data, error } = await supabase
      .from('system_users')
      .update({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteUser(id: string) {
    const { error } = await supabase
      .from('system_users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Student Attendance API
  static async getStudentAttendance(date?: string) {
    let query = supabase
      .from('student_attendance')
      .select('*');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Staff Attendance API
  static async getStaffAttendance(date?: string) {
    let query = supabase
      .from('staff_attendance')
      .select('*');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Visitor Records API
  static async getVisitorRecords(date?: string) {
    let query = supabase
      .from('visitor_records')
      .select('*');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Parent Pickup Records API
  static async getParentPickupRecords(date?: string) {
    let query = supabase
      .from('parent_pickup_records')
      .select('*');

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}