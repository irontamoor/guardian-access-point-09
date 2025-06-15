
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserFetching() {
  const fetchStudentUser = useCallback(async (userCode: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", userCode)
      .eq("role", "student")
      .eq("status", "active")
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }
    return data;
  }, []);

  const fetchStaffUser = useCallback(async (userCode: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", userCode)
      .eq("role", "staff")
      .eq("status", "active")
      .single();

    if (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
    return data;
  }, []);

  return {
    fetchStudentUser,
    fetchStaffUser,
  };
}
