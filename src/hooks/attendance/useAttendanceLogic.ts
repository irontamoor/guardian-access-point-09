
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
    const recordData = {
      user_id: userId,
      status,
      notes: notes || null,
      ...(status === "in" 
        ? { check_in_time: new Date().toISOString() }
        : { check_out_time: new Date().toISOString() }
      )
    };

    const result = await query(
      `INSERT INTO attendance_records (user_id, status, check_in_time, check_out_time, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [recordData.user_id, recordData.status, recordData.check_in_time || null, recordData.check_out_time || null, recordData.notes]
    );

    return result.rows[0];
  }, []);

  return {
    isValidCode,
    hasTodaySignIn,
    createAttendanceRecord,
  };
}
