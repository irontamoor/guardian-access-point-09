
import { useCallback } from "react";
import { query } from "@/integrations/postgres/client";

export type AttendanceStatusMap = Record<string, 'present' | 'absent'>;

export function useAttendanceMapping() {
  const getAttendanceMap = useCallback(async (): Promise<AttendanceStatusMap> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const result = await query(
        `SELECT user_id, status FROM attendance_records 
         WHERE DATE(created_at) = $1 
         ORDER BY created_at DESC`,
        [today]
      );

      const statusMap: AttendanceStatusMap = {};
      
      result.rows?.forEach((record: any) => {
        if (!statusMap[record.user_id]) {
          statusMap[record.user_id] = record.status === 'in' ? 'present' : 'absent';
        }
      });

      return statusMap;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return {};
    }
  }, []);

  return { getAttendanceMap };
}
