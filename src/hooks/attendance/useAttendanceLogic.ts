
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceLogic = () => {
  const isValidCode = (code: string): boolean => {
    return code && code.trim().length > 0;
  };

  const hasTodaySignIn = async (userId: string): Promise<boolean> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check both student and staff attendance tables
      const [studentResult, staffResult] = await Promise.all([
        supabase
          .from('student_attendance')
          .select('id')
          .eq('student_id', userId)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .limit(1),
        supabase
          .from('staff_attendance')
          .select('id')
          .eq('employee_id', userId)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .limit(1)
      ]);

      return (studentResult.data && studentResult.data.length > 0) ||
             (staffResult.data && staffResult.data.length > 0);
    } catch (error) {
      console.error('Error checking today sign in:', error);
      return false;
    }
  };

  const createAttendanceRecord = async (userId: string, status: "in" | "out", notes?: string) => {
    // Since we now have dedicated tables, this function would need to know
    // which table to insert into. For now, this is a placeholder that would
    // need to be implemented in the calling components with the specific table logic
    console.warn('createAttendanceRecord is deprecated. Use dedicated table insert operations instead.');
    throw new Error('This function needs to be implemented with specific table logic');
  };

  return {
    isValidCode,
    hasTodaySignIn,
    createAttendanceRecord,
  };
};
