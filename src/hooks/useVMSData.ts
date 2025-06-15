
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Types for our data structures
export interface Student {
  id: string;
  name: string;
  grade: string; // Keep as empty string if needed; no board_type
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
      // Correctly map "in" to present and "out" to absent
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
