
import { query } from '@/integrations/postgres/client';

export class VMSApi {
  // Users API
  static async getUsers(role?: string) {
    const sql = role 
      ? "SELECT * FROM system_users WHERE role = $1 ORDER BY created_at DESC"
      : "SELECT * FROM system_users ORDER BY created_at DESC";
    const params = role ? [role] : [];
    const result = await query(sql, params);
    return result.rows;
  }

  static async createUser(userData: any) {
    const result = await query(
      `INSERT INTO system_users (first_name, last_name, email, phone, role, status, user_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userData.first_name, userData.last_name, userData.email, userData.phone, userData.role, userData.status, userData.user_code]
    );
    return result.rows[0];
  }

  static async updateUser(id: string, userData: any) {
    const result = await query(
      `UPDATE system_users SET first_name = $2, last_name = $3, email = $4, phone = $5, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      [id, userData.first_name, userData.last_name, userData.email, userData.phone]
    );
    return result.rows[0];
  }

  static async deleteUser(id: string) {
    await query("DELETE FROM system_users WHERE id = $1", [id]);
  }

  // Attendance API
  static async getAttendanceRecords(date?: string) {
    const sql = date 
      ? `SELECT ar.*, su.first_name, su.last_name, su.role 
         FROM attendance_records ar 
         LEFT JOIN system_users su ON ar.user_id = su.id 
         WHERE DATE(ar.created_at) = $1 
         ORDER BY ar.created_at DESC`
      : `SELECT ar.*, su.first_name, su.last_name, su.role 
         FROM attendance_records ar 
         LEFT JOIN system_users su ON ar.user_id = su.id 
         ORDER BY ar.created_at DESC`;
    const params = date ? [date] : [];
    const result = await query(sql, params);
    return result.rows;
  }

  static async createAttendanceRecord(attendanceData: any) {
    const result = await query(
      `INSERT INTO attendance_records (user_id, status, check_in_time, check_out_time, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [attendanceData.user_id, attendanceData.status, attendanceData.check_in_time, attendanceData.check_out_time, attendanceData.notes]
    );
    return result.rows[0];
  }

  static async updateAttendanceRecord(id: string, attendanceData: any) {
    const result = await query(
      `UPDATE attendance_records SET status = $2, check_in_time = $3, check_out_time = $4, notes = $5 
       WHERE id = $1 RETURNING *`,
      [id, attendanceData.status, attendanceData.check_in_time, attendanceData.check_out_time, attendanceData.notes]
    );
    return result.rows[0];
  }

  // Visitors API
  static async getVisitors() {
    const result = await query("SELECT * FROM visitors ORDER BY created_at DESC");
    return result.rows;
  }

  static async createVisitor(visitorData: any) {
    const result = await query(
      `INSERT INTO visitors (first_name, last_name, organization, visit_purpose, host_name, phone_number, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [visitorData.first_name, visitorData.last_name, visitorData.organization, visitorData.visit_purpose, visitorData.host_name, visitorData.phone_number, visitorData.notes]
    );
    return result.rows[0];
  }

  // System Settings API
  static async getSettings() {
    const result = await query("SELECT * FROM system_settings");
    return result.rows;
  }

  static async updateSetting(key: string, value: any) {
    const result = await query(
      `INSERT INTO system_settings (setting_key, setting_value) VALUES ($1, $2) 
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW() 
       RETURNING *`,
      [key, JSON.stringify(value)]
    );
    return result.rows[0];
  }
}
