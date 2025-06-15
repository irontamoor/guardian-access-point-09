
import { supabase } from "@/integrations/supabase/client";

// Re-export types from the new modular structure
export type { Student, Staff } from "./usePeopleData";
export type { ActivityRecord } from "./useActivityFeedState";

// Attendance map for typing convenience
type AttendanceStatusMap = Record<
  string,
  { status: 'present' | 'absent'; check_in_time?: string; check_out_time?: string }
>;

// MAIN HOOK
import { usePeopleData } from "./usePeopleData";
import { useActivityFeedState } from "./useActivityFeedState";

export const useVMSData = () => {
  const {
    students,
    staff,
    loading,
    error,
    loadPeople,
  } = usePeopleData();

  const { recentActivity } = useActivityFeedState(students, staff);

  // Add student (system_users)
  const addStudent = async (studentData: Omit<typeof students[0], 'status' | 'check_in_time' | 'check_out_time'>) => {
    const { id, name, grade } = studentData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
      id,
      first_name,
      last_name,
      role: 'student'
    });
    if (error) throw error;
    loadPeople();
  };

  // Add staff (system_users)
  const addStaff = async (staffData: Omit<typeof staff[0], 'status' | 'check_in_time' | 'check_out_time'>) => {
    const { id, name, department } = staffData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
      id,
      first_name,
      last_name,
      role: 'staff'
    });
    if (error) throw error;
    loadPeople();
  };

  // Update student attendance
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await supabase.from("attendance_records").insert({
      user_id: userId,
      status: status === "present" ? "in" : "out",
      ...(status === "present" ? { check_in_time: time || new Date().toISOString() } : { check_out_time: time || new Date().toISOString() })
    });
    loadPeople();
  };

  // Update staff attendance
  const updateStaffStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await supabase.from("attendance_records").insert({
      user_id: userId,
      status: status === "present" ? "in" : "out",
      ...(status === "present" ? { check_in_time: time || new Date().toISOString() } : { check_out_time: time || new Date().toISOString() })
    });
    loadPeople();
  };

  return {
    students,
    staff,
    recentActivity,
    loading,
    error,
    addStudent,
    addStaff,
    updateStudentStatus,
    updateStaffStatus,
    reload: loadPeople
  };
};
