
import { supabase } from "@/integrations/supabase/client";

export function useAttendanceOperations() {
  // Update student attendance
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await supabase.from("attendance_records").insert({
      user_id: userId,
      status: status === "present" ? "in" : "out",
      ...(status === "present" ? { check_in_time: time || new Date().toISOString() } : { check_out_time: time || new Date().toISOString() })
    });
  };

  // Update staff attendance
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await supabase.from("attendance_records").insert({
      user_id: userId,
      status: status === "present" ? "in" : "out",
      ...(status === "present" ? { check_in_time: time || new Date().toISOString() } : { check_out_time: time || new Date().toISOString() })
    });
  };

  return {
    updateStudentStatus,
    updateStaffStatus,
  };
}
