
import { supabase } from "@/integrations/supabase/client";
import { useAttendanceQueries } from "./useAttendanceQueries";

export const useAttendanceData = () => {
  const attendanceQueries = useAttendanceQueries();

  const fetchAttendanceRecords = async (filters?: any) => {
    let query = supabase
      .from("attendance_records")
      .select(`
        *,
        system_users!attendance_records_user_id_fkey (
          id,
          first_name,
          last_name,
          user_code,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (filters?.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("created_at", filters.endDate);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.role) {
      query = query.eq("system_users.role", filters.role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  };

  const updateAttendanceRecord = async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("attendance_records")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteAttendanceRecord = async (id: string) => {
    const { error } = await supabase
      .from("attendance_records")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  };

  return {
    fetchAttendanceRecords,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    ...attendanceQueries,
  };
};
