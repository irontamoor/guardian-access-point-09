
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

      // Load recent activity
      const { data: activityData, error: activityError } = await supabase
        .from('attendance_records')
        .select(`
          *,
          system_users(first_name, last_name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;
      setRecentActivity(activityData || []);
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
      // Create attendance record for today
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`
        });

      if (error) throw error;

      console.log(`Student ${userId} attendance updated to ${status}`);
      // Reload data to refresh the dashboard
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
      // Create attendance record for today
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`
        });

      if (error) throw error;

      console.log(`Staff ${userId} attendance updated to ${status}`);
      // Reload data to refresh the dashboard
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
