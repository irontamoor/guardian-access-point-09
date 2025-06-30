
import { query } from "@/integrations/postgres/client";
import { useAttendanceQueries } from "./useAttendanceQueries";

export const useAttendanceData = () => {
  const attendanceQueries = useAttendanceQueries();

  const fetchAttendanceRecords = async (filters?: any) => {
    let sql = `
      SELECT ar.*, su.id, su.first_name, su.last_name, su.user_code, su.role
      FROM attendance_records ar
      LEFT JOIN system_users su ON ar.user_id = su.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.startDate) {
      sql += ` AND ar.created_at >= $${paramIndex}`;
      params.push(filters.startDate);
      paramIndex++;
    }
    if (filters?.endDate) {
      sql += ` AND ar.created_at <= $${paramIndex}`;
      params.push(filters.endDate);
      paramIndex++;
    }
    if (filters?.status) {
      sql += ` AND ar.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    if (filters?.role) {
      sql += ` AND su.role = $${paramIndex}`;
      params.push(filters.role);
      paramIndex++;
    }

    sql += ` ORDER BY ar.created_at DESC`;

    const result = await query(sql, params);
    return result.rows || [];
  };

  const updateAttendanceRecord = async (id: string, updates: any) => {
    const result = await query(
      `UPDATE attendance_records SET 
       status = $1, check_in_time = $2, check_out_time = $3, notes = $4 
       WHERE id = $5 RETURNING *`,
      [updates.status, updates.check_in_time, updates.check_out_time, updates.notes, id]
    );
    
    return result.rows[0];
  };

  const deleteAttendanceRecord = async (id: string) => {
    await query('DELETE FROM attendance_records WHERE id = $1', [id]);
  };

  return {
    fetchAttendanceRecords,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    ...attendanceQueries,
  };
};
