
import { query } from "@/integrations/postgres/client";

export const useAttendanceQueries = () => {
  const fetchAttendanceByDateRange = async (startDate: string, endDate: string) => {
    const result = await query(`
      SELECT ar.*, su.id, su.first_name, su.last_name, su.user_code, su.role
      FROM attendance_records ar
      LEFT JOIN system_users su ON ar.user_id = su.id
      WHERE ar.created_at >= $1 AND ar.created_at <= $2
      ORDER BY ar.created_at DESC
    `, [startDate, endDate]);

    return result.rows || [];
  };

  const fetchAttendanceByUser = async (userId: string) => {
    const result = await query(`
      SELECT ar.*, su.id, su.first_name, su.last_name, su.user_code, su.role
      FROM attendance_records ar
      LEFT JOIN system_users su ON ar.user_id = su.id
      WHERE ar.user_id = $1
      ORDER BY ar.created_at DESC
    `, [userId]);

    return result.rows || [];
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    return fetchAttendanceByDateRange(
      `${today}T00:00:00.000Z`,
      `${today}T23:59:59.999Z`
    );
  };

  return {
    fetchAttendanceByDateRange,
    fetchAttendanceByUser,
    fetchTodayAttendance,
  };
};
