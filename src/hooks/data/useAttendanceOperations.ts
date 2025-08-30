
import { supabase } from "@/integrations/supabase/client";

export function useAttendanceOperations() {
  // Update student attendance - now uses dedicated student_attendance table
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    // Get student data from system_users
    const { data: studentData, error: userError } = await supabase
      .from('system_users')
      .select('user_code, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const insertData: any = {
      student_id: studentData.user_code || userId,
      student_name: `${studentData.first_name} ${studentData.last_name}`,
      status: attendanceStatus,
    };
    insertData[timeField] = timestamp;

    const { error } = await supabase
      .from('student_attendance')
      .insert(insertData);

    if (error) throw error;
  };

  // Update staff attendance - now uses dedicated staff_attendance table
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    // Get staff data from system_users
    const { data: staffData, error: userError } = await supabase
      .from('system_users')
      .select('user_code, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const insertData: any = {
      employee_id: staffData.user_code || userId,
      employee_name: `${staffData.first_name} ${staffData.last_name}`,
      status: attendanceStatus,
    };
    insertData[timeField] = timestamp;

    const { error } = await supabase
      .from('staff_attendance')
      .insert(insertData);

    if (error) throw error;
  };

  return {
    updateStudentStatus,
    updateStaffStatus,
  };
}
