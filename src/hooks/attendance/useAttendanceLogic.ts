
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAttendanceLogic() {
  const isValidCode = useCallback((code: string): boolean => {
    return code.trim().length > 0;
  }, []);

  const hasTodaySignIn = useCallback(async (userId: string): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'in')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .limit(1);

      if (error) throw error;
      return (data && data.length > 0);
    } catch (error) {
      console.error('Error checking today sign-in:', error);
      return false;
    }
  }, []);

  const createAttendanceRecord = useCallback(async (userId: string, status: "in" | "out", notes?: string) => {
    const now = new Date().toISOString();
    const checkInTime = status === "in" ? now : null;
    const checkOutTime = status === "out" ? now : null;

    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        user_id: userId,
        status,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }, []);

  return {
    isValidCode,
    hasTodaySignIn,
    createAttendanceRecord,
  };
}
