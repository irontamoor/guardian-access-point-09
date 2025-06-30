
import { useCallback } from "react";
import { query } from "@/integrations/postgres/client";

export function useAttendanceLogic() {
  const isValidCode = useCallback((code: string): boolean => {
    return code.trim().length > 0;
  }, []);

  const hasTodaySignIn = useCallback(async (userId: string): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const result = await query(
        `SELECT id FROM attendance_records 
         WHERE user_id = $1 AND status = $2 AND DATE(created_at) = $3 
         LIMIT 1`,
        [userId, "in", today]
      );

      return (result.rows && result.rows.length > 0);
    } catch (error) {
      console.error('Error checking today sign-in:', error);
      return false;
    }
  }, []);

  const createAttendanceRecord = useCallback(async (userId: string, status: "in" | "out", notes?: string) => {
    const now = new Date().toISOString();
    const checkInTime = status === "in" ? now : null;
    const checkOutTime = status === "out" ? now : null;

    const result = await query(
      `INSERT INTO attendance_records (user_id, status, check_in_time, check_out_time, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, status, checkInTime, checkOutTime, notes || null]
    );

    return result.rows[0];
  }, []);

  return {
    isValidCode,
    hasTodaySignIn,
    createAttendanceRecord,
  };
}
