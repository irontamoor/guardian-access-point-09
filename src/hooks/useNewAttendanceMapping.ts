import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AttendanceStatusMap = Record<string, 'present' | 'absent'>;

export function useNewAttendanceMapping() {
  const getAttendanceMap = useCallback(async (): Promise<AttendanceStatusMap> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Query both student and staff attendance tables for today
      const [studentResult, staffResult] = await Promise.all([
        supabase
          .from('student_attendance')
          .select('student_id, status, created_at')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false }),
        supabase
          .from('staff_attendance')
          .select('employee_id, status, created_at')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false })
      ]);

      const statusMap: AttendanceStatusMap = {};
      
      // Process student attendance records - get latest status for each student
      const studentsByUser: Record<string, any> = {};
      (studentResult.data || []).forEach((record: any) => {
        if (!studentsByUser[record.student_id] || new Date(record.created_at) > new Date(studentsByUser[record.student_id].created_at)) {
          studentsByUser[record.student_id] = record;
        }
      });
      
      Object.values(studentsByUser).forEach((record: any) => {
        statusMap[record.student_id] = record.status === 'in' ? 'present' : 'absent';
      });
      
      // Process staff attendance records - get latest status for each staff member
      const staffByUser: Record<string, any> = {};
      (staffResult.data || []).forEach((record: any) => {
        if (!staffByUser[record.employee_id] || new Date(record.created_at) > new Date(staffByUser[record.employee_id].created_at)) {
          staffByUser[record.employee_id] = record;
        }
      });
      
      Object.values(staffByUser).forEach((record: any) => {
        statusMap[record.employee_id] = record.status === 'in' ? 'present' : 'absent';
      });

      return statusMap;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return {};
    }
  }, []);

  return { getAttendanceMap };
}