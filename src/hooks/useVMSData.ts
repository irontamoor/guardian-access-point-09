
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

export interface Visitor {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  host_name: string;
  purpose: string;
  badge_id: string;
  status: 'active' | 'checked_out';
  check_in_time: string;
  check_out_time?: string;
}

export interface ParentPickup {
  id: string;
  parent_name: string;
  student_name: string;
  student_id: string;
  car_registration: string;
  pickup_type: 'pickup' | 'dropoff';
  status: 'pending' | 'completed' | 'cancelled';
  request_time: string;
  completion_time?: string;
}

export interface ActivityRecord {
  id: string;
  type: 'student' | 'staff' | 'visitor' | 'parent';
  name: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

// Map table to interface transformation helpers:
const parseStudent = (user: Database["public"]["Tables"]["system_users"]["Row"]): Student => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: (user.board_type ? `Board: ${user.board_type}` : ""),
  status: "absent", // This will be updated based on attendance_records
});
const parseStaff = (user: Database["public"]["Tables"]["system_users"]["Row"]): Staff => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: user.employee_id ? `ID: ${user.employee_id}` : "",
  status: "absent", // This will be updated based on attendance_records
});

// Query helpers
async function getUsersByRole(role: string): Promise<Database["public"]["Tables"]["system_users"]["Row"][]> {
  const { data, error } = await supabase
    .from("system_users")
    .select("*")
    .eq("role", role)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function getAttendanceMap(): Promise<Record<string, { status: string; check_in_time?: string; check_out_time?: string; }>> {
  // Query latest attendance for each user for today
  const { data, error } = await supabase
    .from("attendance_records")
    .select("user_id, status, check_in_time, check_out_time")
    .order("created_at", { ascending: false });
  if (error) throw error;
  // Return a map of user_id -> status/check in/out time
  const map: Record<string, { status: string; check_in_time?: string; check_out_time?: string; }> = {};
  (data || []).forEach((row: any) => {
    // Only save the first seen record for each user (most recent due to order)
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
export const useVMSData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [pickups, setPickups] = useState<ParentPickup[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load students & staff from backend, with attendance status
  const loadPeople = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get data
      const [studentRows, staffRows, attendanceMap] = await Promise.all([
        getUsersByRole("student"),
        getUsersByRole("staff"),
        getAttendanceMap()
      ]);
      // Students
      const studentsList: Student[] = studentRows.map(u => {
        const att = attendanceMap[u.id] ?? {};
        return {
          ...parseStudent(u),
          status: att.status ?? "absent",
          check_in_time: att.check_in_time,
          check_out_time: att.check_out_time,
        };
      });
      setStudents(studentsList);

      // Staff
      const staffList: Staff[] = staffRows.map(u => {
        const att = attendanceMap[u.id] ?? {};
        return {
          ...parseStaff(u),
          status: att.status ?? "absent",
          check_in_time: att.check_in_time,
          check_out_time: att.check_out_time,
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
  }, []);

  // Visitors (direct mapping)
  const loadVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select("*")
        .order('check_in_time', { ascending: false });
      if (error) throw error;
      setVisitors((data ?? []) as Visitor[]);
    } catch (e: any) {
      setError("Failed to load visitors: " + e.message);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pickups (direct mapping)
  const loadPickups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('parent_pickups')
        .select("*")
        .order('request_time', { ascending: false });
      if (error) throw error;
      setPickups((data ?? []) as ParentPickup[]);
    } catch (e: any) {
      setError("Failed to load pickups: " + e.message);
      setPickups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all people/records on mount
  useEffect(() => {
    loadPeople();
    loadVisitors();
    loadPickups();
  }, [loadPeople, loadVisitors, loadPickups]);

  // Generate recent activity
  useEffect(() => {
    function buildActivity(): ActivityRecord[] {
      const activity: ActivityRecord[] = [
        ...students.filter(s => s.status === 'present').map(s => ({
          id: s.id + '_activity',
          type: 'student' as const,
          name: s.name,
          action: 'Signed In',
          time: s.check_in_time || '',
          status: 'success' as const
        })),
        ...staff.filter(s => s.status === 'present').map(s => ({
          id: s.id + '_activity',
          type: 'staff' as const,
          name: s.name,
          action: 'Signed In',
          time: s.check_in_time || '',
          status: 'success' as const
        })),
        ...visitors.filter(v => v.status === 'active').map(v => ({
          id: v.id + '_activity',
          type: 'visitor' as const,
          name: v.name,
          action: 'Registered',
          time: v.check_in_time,
          status: 'info' as const
        })),
        ...pickups.filter(p => p.status === 'pending').map(p => ({
          id: p.id + '_activity',
          type: 'parent' as const,
          name: p.parent_name,
          action: 'Pickup Request',
          time: p.request_time,
          status: 'warning' as const
        }))
      ];
      return activity.slice(0, 10);
    }
    setRecentActivity(buildActivity());
  }, [students, staff, visitors, pickups]);

  // --- ADD & UPDATE METHODS ---

  // Add student (system_users)
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    // Map Student type to system_users insert
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

  // Add visitor (visitors)
  const addVisitor = async (visitorData: Omit<Visitor, 'id' | 'badge_id'>) => {
    // badge_id: auto-generated with random 4 digits
    const badge_id = "VIS" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const { error } = await supabase.from("visitors").insert({
      ...visitorData,
      badge_id,
      status: "active",
      check_in_time: new Date().toISOString()
    });
    if (error) throw error;
    loadVisitors();
  };

  // Add pickup (parent_pickups)
  const addPickup = async (pickupData: Omit<ParentPickup, 'id'>) => {
    const { error } = await supabase.from("parent_pickups").insert({
      ...pickupData,
      status: "pending",
      request_time: new Date().toISOString()
    });
    if (error) throw error;
    loadPickups();
  };

  // Update student attendance
  const updateStudentStatus = async (userId: string, status: 'present' | 'absent', time?: string) => {
    // Insert a new attendance_records row
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

  // Update pickup status
  const updatePickupStatus = async (pickupId: string, status: ParentPickup['status'], completionTime?: string) => {
    await supabase
      .from("parent_pickups")
      .update({ status, completion_time: completionTime || new Date().toISOString() })
      .eq('id', pickupId);
    loadPickups();
  };

  return {
    students,
    staff,
    visitors,
    pickups,
    recentActivity,
    loading,
    error,
    addStudent,
    addStaff,
    addVisitor,
    addPickup,
    updateStudentStatus,
    updateStaffStatus,
    updatePickupStatus,
    reload: () => { loadPeople(); loadVisitors(); loadPickups(); }
  };
};

