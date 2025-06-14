
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Attendance map for typing
export type AttendanceStatusMap = Record<
  string,
  { status: 'present' | 'absent'; check_in_time?: string; check_out_time?: string }
>;

export function useAttendanceRecords() {
  // Fetches attendance records and builds the latest status per user ID
  const getAttendanceMap = useCallback(async () => {
    const { data, error } = await supabase
      .from("attendance_records")
      .select("user_id, status, check_in_time, check_out_time")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const map: AttendanceStatusMap = {};
    (data || []).forEach((row: any) => {
      if (!map[row.user_id]) {
        map[row.user_id] = {
          status: row.status === "in" ? "present" : "absent",
          check_in_time: row.check_in_time ?? undefined,
          check_out_time: row.check_out_time ?? undefined,
        };
      }
    });
    return map;
  }, []);

  return { getAttendanceMap };
}
