
import { supabase } from "@/integrations/supabase/client";

export function useAttendanceOperations() {
  // Update student attendance
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    const insertData: any = {
      user_id: userId,
      status: attendanceStatus,
    };
    insertData[timeField] = timestamp;

    const { error } = await supabase
      .from('attendance_records')
      .insert(insertData);

    if (error) throw error;
  };

  // Update staff attendance
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    const insertData: any = {
      user_id: userId,
      status: attendanceStatus,
    };
    insertData[timeField] = timestamp;

    const { error } = await supabase
      .from('attendance_records')
      .insert(insertData);

    if (error) throw error;
  };

  return {
    updateStudentStatus,
    updateStaffStatus,
  };
}
