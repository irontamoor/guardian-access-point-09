
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceQueries = () => {
  // These functions are deprecated since we moved to dedicated tables
  // The new tabbed system uses dedicated hooks for each table type
  
  const fetchAttendanceByDateRange = async (startDate: string, endDate: string) => {
    console.warn('fetchAttendanceByDateRange is deprecated. Use dedicated table hooks instead.');
    return [];
  };

  const fetchAttendanceByUser = async (userId: string) => {
    console.warn('fetchAttendanceByUser is deprecated. Use dedicated table hooks instead.');
    return [];
  };

  const fetchTodayAttendance = async () => {
    console.warn('fetchTodayAttendance is deprecated. Use dedicated table hooks instead.');
    return [];
  };

  return {
    fetchAttendanceByDateRange,
    fetchAttendanceByUser,
    fetchTodayAttendance,
  };
};
