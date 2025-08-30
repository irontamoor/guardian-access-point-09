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
      // Load students with current status
      console.log('useVMSData: Loading students...');
      const { data: studentsData, error: studentsError } = await supabase
        .from('system_users')
        .select('*')
        .eq('role', 'student')
        .eq('status', 'active');

      if (studentsError) {
        console.error('Error loading students:', studentsError);
        throw studentsError;
      }

      console.log('useVMSData: Students loaded:', studentsData?.length || 0);

      // Load staff with current status
      console.log('useVMSData: Loading staff...');
      const { data: staffData, error: staffError } = await supabase
        .from('system_users')
        .select('*')
        .eq('role', 'staff')
        .eq('status', 'active');

      if (staffError) {
        console.error('Error loading staff:', staffError);
        throw staffError;
      }

      console.log('useVMSData: Staff loaded:', staffData?.length || 0);

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
      const enrichedStudents = (studentsData || []).map(student => ({
        ...student,
        name: `${student.first_name} ${student.last_name}`,
        grade: student.user_code || 'N/A',
        status: userStatusMap.get(student.user_code || student.id)?.status || 'absent',
        check_in_time: userStatusMap.get(student.user_code || student.id)?.check_in_time || null
      }));

      // Enrich staff with status
      const enrichedStaff = (staffData || []).map(staff => ({
        ...staff,
        name: `${staff.first_name} ${staff.last_name}`,
        status: userStatusMap.get(staff.user_code || staff.id)?.status || 'absent',
        check_in_time: userStatusMap.get(staff.user_code || staff.id)?.check_in_time || null
      }));

      setStudents(enrichedStudents);
      setStaff(enrichedStaff);

      // Set empty recent activity for now (this could be enhanced later to combine recent records from all tables)
      setRecentActivity([]);
      
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