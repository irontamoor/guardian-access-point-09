
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AttendanceStatusMap = Record<string, 'present' | 'absent'>;

export function useAttendanceMapping() {
  const getAttendanceMap = useCallback(async (): Promise<AttendanceStatusMap> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('user_id, status')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const statusMap: AttendanceStatusMap = {};
      
      data?.forEach((record: any) => {
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
