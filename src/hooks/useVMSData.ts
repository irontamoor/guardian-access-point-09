import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useVMSData() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    console.log('useVMSData: Starting to load data...');
    setLoading(true);
    setError(null);
    
    try {
      // Load students from dedicated students table (public kiosk-safe)
      console.log('useVMSData: Loading students...');
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, grade, status')
        .eq('status', 'active');

      if (studentsError) {
        console.error('Error loading students:', studentsError);
        throw studentsError;
      }

      // Map students to common format
      const mappedStudents = (studentsData || []).map(s => ({
        id: s.id,
        user_code: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'student' as const,
        status: s.status
      }));

      console.log('useVMSData: Students loaded:', mappedStudents.length);

      // Load staff from dedicated staff table (public kiosk-safe)
      console.log('useVMSData: Loading staff...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, employee_id, first_name, last_name, department, position, status')
        .eq('status', 'active');

      if (staffError) {
        console.error('Error loading staff:', staffError);
        throw staffError;
      }

      // Map staff to common format
      const mappedStaff = (staffData || []).map(s => ({
        id: s.id,
        user_code: s.employee_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'staff' as const,
        status: s.status
      }));

      console.log('useVMSData: Staff loaded:', mappedStaff.length);

      // Get today's attendance from dedicated tables
      const today = new Date().toISOString().split('T')[0];
      console.log('useVMSData: Loading today\'s attendance for:', today);
      
      const [studentAttendance, staffAttendance] = await Promise.all([
        supabase
          .from('student_attendance')
          .select('*')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false }),
        supabase
          .from('staff_attendance')
          .select('*')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false })
      ]);

      console.log('useVMSData: Today\'s student attendance records:', studentAttendance.data?.length || 0);
      console.log('useVMSData: Today\'s staff attendance records:', staffAttendance.data?.length || 0);

      // Create a map of latest status for each user
      const userStatusMap = new Map();
      
      // Process student attendance
      if (studentAttendance.data) {
        studentAttendance.data.forEach(record => {
          if (!userStatusMap.has(record.student_id)) {
            userStatusMap.set(record.student_id, {
              status: record.status === 'in' ? 'present' : 'absent',
              check_in_time: record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : null
            });
          }
        });
      }
      
      // Process staff attendance
      if (staffAttendance.data) {
        staffAttendance.data.forEach(record => {
          if (!userStatusMap.has(record.employee_id)) {
            userStatusMap.set(record.employee_id, {
              status: record.status === 'in' ? 'present' : 'absent',
              check_in_time: record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : null
            });
          }
        });
      }

      // Enrich students with status
      const enrichedStudents = mappedStudents.map(student => ({
        ...student,
        name: `${student.first_name} ${student.last_name}`,
        grade: student.user_code || 'N/A',
        status: userStatusMap.get(student.user_code || student.id)?.status || 'absent',
        check_in_time: userStatusMap.get(student.user_code || student.id)?.check_in_time || null
      }));

      // Enrich staff with status
      const enrichedStaff = mappedStaff.map(staff => ({
        ...staff,
        name: `${staff.first_name} ${staff.last_name}`,
        status: userStatusMap.get(staff.user_code || staff.id)?.status || 'absent',
        check_in_time: userStatusMap.get(staff.user_code || staff.id)?.check_in_time || null
      }));

      setStudents(enrichedStudents);
      setStaff(enrichedStaff);

      // Fetch recent activity from all tables
      const [studentRecords, staffRecords, visitorRecords, pickupRecords] = await Promise.all([
        supabase
          .from('student_attendance')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('staff_attendance')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('visitor_records')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('parent_pickup_records')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Combine and format all activity
      const combinedActivity = [
        ...(studentRecords.data || []).map(r => ({
          id: r.id,
          type: 'student',
          name: r.student_name,
          action: r.status === 'in' ? 'Check In' : 'Check Out',
          time: new Date(r.created_at).toLocaleString(),
          timestamp: new Date(r.created_at).getTime()
        })),
        ...(staffRecords.data || []).map(r => ({
          id: r.id,
          type: 'staff',
          name: r.employee_name,
          action: r.status === 'in' ? 'Check In' : 'Check Out',
          time: new Date(r.created_at).toLocaleString(),
          timestamp: new Date(r.created_at).getTime()
        })),
        ...(visitorRecords.data || []).map(r => ({
          id: r.id,
          type: 'visitor',
          name: `${r.first_name} ${r.last_name}`,
          action: r.status === 'in' ? 'Check In' : 'Check Out',
          time: new Date(r.created_at).toLocaleString(),
          timestamp: new Date(r.created_at).getTime()
        })),
        ...(pickupRecords.data || []).map(r => ({
          id: r.id,
          type: 'pickup',
          name: r.student_name || r.student_id,
          action: `${r.action_type} by ${r.parent_guardian_name}`,
          time: new Date(r.created_at).toLocaleString(),
          timestamp: new Date(r.created_at).getTime()
        }))
      ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

      setRecentActivity(combinedActivity);
      
      console.log('useVMSData: Data loading completed successfully');
    } catch (err: any) {
      console.error('useVMSData: Error loading data:', err);
      setError(err.message);
      toast({
        title: "Error Loading Data",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const updateStudentStatus = async (userId: string, status: "present" | "absent") => {
    // This function would need to be updated to use the new student_attendance table
    console.warn('updateStudentStatus needs to be updated for the new table structure');
    toast({
      title: "Info",
      description: "Status update functionality needs to be updated for the new system",
      variant: "default"
    });
  };

  const updateStaffStatus = async (userId: string, status: "present" | "absent") => {
    // This function would need to be updated to use the new staff_attendance table
    console.warn('updateStaffStatus needs to be updated for the new table structure');
    toast({
      title: "Info",
      description: "Status update functionality needs to be updated for the new system",
      variant: "default"
    });
  };

  return {
    students,
    staff,
    recentActivity,
    loading,
    error,
    isLoading,
    updateStudentStatus,
    updateStaffStatus,
    loadData
  };
}