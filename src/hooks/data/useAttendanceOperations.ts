import { supabase } from "@/integrations/supabase/client";

export function useAttendanceOperations() {
  // Update student attendance - uses dedicated students table for lookup
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    // Get student data from students table (public kiosk-safe)
    const { data: studentData, error: userError } = await supabase
      .from('students')
      .select('student_id, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const insertData: any = {
      student_id: studentData.student_id || userId,
      student_name: `${studentData.first_name} ${studentData.last_name}`,
      status: attendanceStatus,
    };
    insertData[timeField] = timestamp;

    const { error } = await supabase
      .from('student_attendance')
      .insert(insertData);

    if (error) throw error;
  };

  // Update staff attendance - uses dedicated staff table for lookup
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    const timestamp = time || new Date().toISOString();
    const attendanceStatus = status === "present" ? "in" : "out";
    const timeField = status === "present" ? "check_in_time" : "check_out_time";
    
    // Get staff data from staff table (public kiosk-safe)
    const { data: staffData, error: userError } = await supabase
      .from('staff')
      .select('employee_id, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const insertData: any = {
      employee_id: staffData.employee_id || userId,
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
