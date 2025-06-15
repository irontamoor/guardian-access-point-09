
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Extracted attendance logic for students
export const useStudentAttendance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isValidCode = (str: string) => !!str.trim();

  const fetchStudentUser = async (code: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", code)
      .eq("role", "student")
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return data;
  };

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

  // Accepts optional notes argument!
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
    loading,
    setLoading,
    isValidCode,
    fetchStudentUser,
    hasTodaySignIn,
    createAttendanceRecord,
    toast,
  };
};
