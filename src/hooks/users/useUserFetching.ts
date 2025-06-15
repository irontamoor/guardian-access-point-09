
import { supabase } from "@/integrations/supabase/client";

export const useUserFetching = () => {
  const fetchStudentUser = async (code: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", code)
      .eq("role", "student")
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const fetchStaffUser = async (code: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", code)
      .eq("role", "staff")
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  return {
    fetchStudentUser,
    fetchStaffUser,
  };
};
