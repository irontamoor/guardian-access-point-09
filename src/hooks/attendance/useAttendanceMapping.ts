
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AttendanceStatusMap = Record<string, 'present' | 'absent'>;

export function useAttendanceMapping() {
  const getAttendanceMap = useCallback(async (): Promise<AttendanceStatusMap> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Query both student and staff attendance tables for today
      const [studentResult, staffResult] = await Promise.all([
        supabase
          .from('student_attendance')
          .select('student_id, status')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false }),
        supabase
          .from('staff_attendance')
          .select('employee_id, status')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false })
      ]);

      const statusMap: AttendanceStatusMap = {};
      
      // Process student attendance records
      (studentResult.data || []).forEach((record: any) => {
        if (!statusMap[record.student_id]) {
          statusMap[record.student_id] = record.status === 'in' ? 'present' : 'absent';
        }
      });
      
      // Process staff attendance records
      (staffResult.data || []).forEach((record: any) => {
        if (!statusMap[record.employee_id]) {
          statusMap[record.employee_id] = record.status === 'in' ? 'present' : 'absent';
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
