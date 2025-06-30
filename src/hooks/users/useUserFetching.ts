
import { useCallback } from "react";
import { query } from "@/integrations/postgres/client";

export function useUserFetching() {
  const fetchStudentUser = useCallback(async (userCode: string) => {
    try {
      const result = await query(
        "SELECT * FROM system_users WHERE user_code = $1 AND role = $2 AND status = $3",
        [userCode, 'student', 'active']
      );

      if (result.rows.length === 0) {
        console.error('Student not found');
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  }, []);

  const fetchStaffUser = useCallback(async (userCode: string) => {
    try {
      const result = await query(
        "SELECT * FROM system_users WHERE user_code = $1 AND role = $2 AND status = $3",
        [userCode, 'staff', 'active']
      );

      if (result.rows.length === 0) {
        console.error('Staff not found');
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  }, []);

  return {
    fetchStudentUser,
    fetchStaffUser,
  };
}
