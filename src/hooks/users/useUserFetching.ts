
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserFetching() {
  const fetchStudentUser = useCallback(async (userCode: string) => {
    try {
      // Exclude sensitive columns for security
      const { data, error } = await supabase
        .from('system_users')
        .select('id, admin_id, user_code, first_name, last_name, role, status, created_at, updated_at')
        .eq('user_code', userCode)
        .eq('role', 'student')
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Student not found:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  }, []);

  const fetchStaffUser = useCallback(async (userCode: string) => {
    try {
      // Exclude sensitive columns for security
      const { data, error } = await supabase
        .from('system_users')
        .select('id, admin_id, user_code, first_name, last_name, role, status, created_at, updated_at')
        .eq('user_code', userCode)
        .eq('role', 'staff')
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Staff not found:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  }, []);

  return {
    fetchStudentUser,
    fetchStaffUser,
  };
}
