
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

export class VMSApi {
  // Users API
  static async getUsers(role?: string) {
    let query = supabase.from('system_users').select('*');
    
    if (role) {
      // Type cast the role parameter to the enum type
      query = query.eq('role', role as UserRole);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
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

  // Attendance API - now includes visitor data in attendance_records
  static async getAttendanceRecords(date?: string) {
    let query = supabase
      .from('attendance_records')
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

  static async createAttendanceRecord(attendanceData: any) {
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        user_id: attendanceData.user_id,
        status: attendanceData.status,
        check_in_time: attendanceData.check_in_time,
        check_out_time: attendanceData.check_out_time,
        notes: attendanceData.notes,
        first_name: attendanceData.first_name,
        last_name: attendanceData.last_name,
        organization: attendanceData.organization,
        visit_purpose: attendanceData.visit_purpose,
        phone_number: attendanceData.phone_number,
        host_name: attendanceData.host_name,
        purpose: attendanceData.purpose,
        company: attendanceData.company
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAttendanceRecord(id: string, attendanceData: any) {
    const { data, error } = await supabase
      .from('attendance_records')
      .update({
        status: attendanceData.status,
        check_in_time: attendanceData.check_in_time,
        check_out_time: attendanceData.check_out_time,
        notes: attendanceData.notes,
        first_name: attendanceData.first_name,
        last_name: attendanceData.last_name,
        organization: attendanceData.organization,
        visit_purpose: attendanceData.visit_purpose,
        phone_number: attendanceData.phone_number
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Legacy visitors API - now redirects to attendance records
  static async getVisitors() {
    // Return attendance records that have visitor data
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .not('organization', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createVisitor(visitorData: any) {
    // Create an attendance record for the visitor
    return this.createAttendanceRecord({
      user_id: visitorData.id || crypto.randomUUID(),
      status: 'in',
      check_in_time: new Date().toISOString(),
      first_name: visitorData.first_name,
      last_name: visitorData.last_name,
      organization: visitorData.organization,
      visit_purpose: visitorData.visit_purpose,
      host_name: visitorData.host_name,
      phone_number: visitorData.phone_number,
      notes: visitorData.notes
    });
  }
}
