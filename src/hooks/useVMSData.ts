
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

      // Get today's attendance to determine who's present
      const today = new Date().toISOString().split('T')[0];
      console.log('useVMSData: Loading today\'s attendance for:', today);
      
      const { data: todayAttendance, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (attendanceError) {
        console.error('Error loading attendance:', attendanceError);
        throw attendanceError;
      }

      console.log('useVMSData: Today\'s attendance records:', todayAttendance?.length || 0);

      // Create a map of latest status for each user
      const userStatusMap = new Map();
      if (todayAttendance) {
        todayAttendance.forEach(record => {
          if (!userStatusMap.has(record.user_id)) {
            userStatusMap.set(record.user_id, {
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
        status: userStatusMap.get(student.id)?.status || 'absent',
        check_in_time: userStatusMap.get(student.id)?.check_in_time || null
      }));

      // Enrich staff with status
      const enrichedStaff = (staffData || []).map(staff => ({
        ...staff,
        name: `${staff.first_name} ${staff.last_name}`,
        status: userStatusMap.get(staff.id)?.status || 'absent',
        check_in_time: userStatusMap.get(staff.id)?.check_in_time || null
      }));

      setStudents(enrichedStudents);
      setStaff(enrichedStaff);

      // Load recent activity from merged attendance_records
      console.log('useVMSData: Loading recent activity...');
      const { data: attendanceData, error: recentError } = await supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) {
        console.error('Error loading recent activity:', recentError);
        throw recentError;
      }

      if (attendanceData && attendanceData.length > 0) {
        // Get system user data for records that reference system users (missing names)
        const userIds = [...new Set(
          attendanceData
            .filter(record => !record.first_name && record.user_id)
            .map(record => record.user_id)
        )];

        let systemUsersMap = new Map();
        if (userIds.length > 0) {
          const { data: systemUsersData } = await supabase
            .from('system_users')
            .select('id, first_name, last_name, user_code, admin_id, role')
            .in('id', userIds);

          if (systemUsersData) {
            systemUsersMap = new Map(systemUsersData.map(u => [u.id, u]));
          }
        }

        // Enrich activity data and convert to the expected format
        const enrichedActivity = attendanceData.map(record => {
          const systemUser = systemUsersMap.get(record.user_id);
          const name = record.first_name && record.last_name 
            ? `${record.first_name} ${record.last_name}`
            : systemUser 
              ? `${systemUser.first_name} ${systemUser.last_name}`
              : 'Unknown User';

          return {
            id: record.id,
            name,
            action: record.status === 'in' ? 'signed in' : 'signed out',
            time: new Date(record.created_at).toLocaleTimeString(),
            type: systemUser?.role || 'visitor',
            status: 'success' as const
          };
        });

        setRecentActivity(enrichedActivity);
        console.log('useVMSData: Recent activity loaded:', enrichedActivity.length);
      } else {
        setRecentActivity([]);
      }

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
    setIsLoading(true);
    try {
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      // Get student info for merged structure
      const { data: student } = await supabase
        .from('system_users')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`,
          first_name: student?.first_name,
          last_name: student?.last_name
        });

      if (error) throw error;

      console.log(`Student ${userId} attendance updated to ${status}`);
      await loadData();
    } catch (error: any) {
      console.error('Error updating student status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffStatus = async (userId: string, status: "present" | "absent") => {
    setIsLoading(true);
    try {
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      // Get staff info for merged structure
      const { data: staff } = await supabase
        .from('system_users')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`,
          first_name: staff?.first_name,
          last_name: staff?.last_name
        });

      if (error) throw error;

      console.log(`Staff ${userId} attendance updated to ${status}`);
      await loadData();
    } catch (error: any) {
      console.error('Error updating staff status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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
