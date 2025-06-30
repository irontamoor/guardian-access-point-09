
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useVMSData() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load students
      const { data: studentsData, error: studentsError } = await supabase
        .from('system_users')
        .select('*')
        .eq('role', 'student')
        .eq('status', 'active');

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Load staff
      const { data: staffData, error: staffError } = await supabase
        .from('system_users')
        .select('*')
        .eq('role', 'staff')
        .eq('status', 'active');

      if (staffError) throw staffError;
      setStaff(staffData || []);

      // Load recent activity from merged attendance_records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (attendanceError) throw attendanceError;

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

        // Enrich activity data
        const enrichedActivity = attendanceData.map(record => {
          const systemUser = systemUsersMap.get(record.user_id);
          
          return {
            ...record,
            system_users: systemUser || null,
            // Use merged data first, fall back to system user
            first_name: record.first_name || systemUser?.first_name,
            last_name: record.last_name || systemUser?.last_name
          };
        });

        setRecentActivity(enrichedActivity);
      } else {
        setRecentActivity([]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading VMS data:', err);
    } finally {
      setLoading(false);
    }
  };

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
