
import { query } from "@/integrations/postgres/client";

export function useAttendanceOperations() {
  // Update student attendance
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    await query(
      `INSERT INTO attendance_records (user_id, status, ${timeField}) VALUES ($1, $2, $3)`,
      [userId, attendanceStatus, timestamp]
    );
  };

  // Update staff attendance
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    await query(
      `INSERT INTO attendance_records (user_id, status, ${timeField}) VALUES ($1, $2, $3)`,
      [userId, attendanceStatus, timestamp]
    );
  };

  return {
    updateStudentStatus,
    updateStaffStatus,
  };
}
