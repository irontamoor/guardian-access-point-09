
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceQueries = () => {
  const fetchAttendanceByDateRange = async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        user:system_users(id, first_name, last_name, user_code, role)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const fetchAttendanceByUser = async (userId: string) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        user:system_users(id, first_name, last_name, user_code, role)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const fetchTodayAttendance = async () => {
    const today = new Date().toISOString().split('T')[0];
    return fetchAttendanceByDateRange(
      `${today}T00:00:00.000Z`,
      `${today}T23:59:59.999Z`
    );
  };

  return {
    fetchAttendanceByDateRange,
    fetchAttendanceByUser,
    fetchTodayAttendance,
  };
};
