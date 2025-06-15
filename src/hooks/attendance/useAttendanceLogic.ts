
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceLogic = () => {
  const isValidCode = (str: string) => !!str.trim();

  const hasTodaySignIn = async (user_id: string) => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const { data, error } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("user_id", user_id)
      .eq("status", "in")
      .gte("check_in_time", start.toISOString())
      .lte("check_in_time", end.toISOString())
      .maybeSingle();
    if (error) return false;
    return !!data;
  };

  const createAttendanceRecord = async (user_id: string, status: "in" | "out", notes?: string) => {
    const now = new Date().toISOString();
    const payload: any = {
      user_id,
      status,
      ...(status === "in" ? { check_in_time: now } : { check_out_time: now }),
      ...(notes ? { notes } : {})
    };
    const { error } = await supabase.from("attendance_records").insert(payload);
    if (error) throw error;
  };

  return {
    isValidCode,
    hasTodaySignIn,
    createAttendanceRecord,
  };
};
