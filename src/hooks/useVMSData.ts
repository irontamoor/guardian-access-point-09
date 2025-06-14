import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Types for our data structures
export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export interface ActivityRecord {
  id: string;
  type: 'student' | 'staff';
  name: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

// Attendance map for typing convenience
type AttendanceStatusMap = Record<
  string,
  { status: 'present' | 'absent'; check_in_time?: string; check_out_time?: string }
>;

// Map table to interface transformation helpers:
const parseStudent = (user: Database["public"]["Tables"]["system_users"]["Row"]): Student => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: user.board_type ? `Board: ${user.board_type}` : "",
  status: "absent", // This will be updated based on attendance_records
});

const parseStaff = (user: Database["public"]["Tables"]["system_users"]["Row"]): Staff => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: user.employee_id ? `ID: ${user.employee_id}` : "",
  status: "absent", // This will be updated based on attendance_records
});

// Query helpers
async function getUsersByRole(role: "student" | "staff"): Promise<Database["public"]["Tables"]["system_users"]["Row"][]> {
  const { data, error } = await supabase
    .from("system_users")
    .select("*")
    .eq("role", role)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function getAttendanceMap(): Promise<AttendanceStatusMap> {
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
}

// MAIN HOOK
import { useSystemUsers, parseStudent, parseStaff } from "./useSystemUsers";
import { useAttendanceRecords } from "./useAttendanceRecords";
import { buildActivityFeed } from "./useActivityFeed";

export const useVMSData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getUsersByRole } = useSystemUsers();
  const { getAttendanceMap } = useAttendanceRecords();

  // Load students & staff from backend, with attendance status
  const loadPeople = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentRows, staffRows, attendanceMap] = await Promise.all([
        getUsersByRole("student"),
        getUsersByRole("staff"),
        getAttendanceMap()
      ]);

      // Students
      const studentsList: Student[] = studentRows.map(u => {
        const att = attendanceMap[u.id];
        return {
          ...parseStudent(u),
          status: att ? att.status : "absent",
          check_in_time: att ? att.check_in_time : undefined,
          check_out_time: att ? att.check_out_time : undefined,
        };
      });
      setStudents(studentsList);

      // Staff
      const staffList: Staff[] = staffRows.map(u => {
        const att = attendanceMap[u.id];
        return {
          ...parseStaff(u),
          status: att ? att.status : "absent",
          check_in_time: att ? att.check_in_time : undefined,
          check_out_time: att ? att.check_out_time : undefined,
        };
      });
      setStaff(staffList);

    } catch (e: any) {
      setError("Failed to load people: " + e.message);
      setStudents([]);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [getUsersByRole, getAttendanceMap]);

  // Load all people/records on mount
  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  // Generate recent activity
  useEffect(() => {
    setRecentActivity(buildActivityFeed(students, staff));
  }, [students, staff]);

  // --- ADD & UPDATE METHODS ---

  // Add student (system_users)
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const first_name = studentData.name.split(" ")[0] || studentData.name;
    const last_name = studentData.name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
      first_name,
      last_name,
      role: 'student'
    });
    if (error) throw error;
    loadPeople();
  };

  // Add staff (system_users)
  const addStaff = async (staffData: Omit<Staff, 'id'>) => {
    const first_name = staffData.name.split(" ")[0] || staffData.name;
    const last_name = staffData.name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
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
    reload: () => { loadPeople(); }
  };
};
