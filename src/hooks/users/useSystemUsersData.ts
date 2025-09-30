
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSystemUsersData() {
  const getUsersByRole = useCallback(async (role: "student" | "staff") => {
    // Exclude sensitive columns for security
    const { data, error } = await supabase
      .from('system_users')
      .select('id, admin_id, user_code, first_name, last_name, role, status, created_at, updated_at')
      .eq('role', role)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, []);

  return { getUsersByRole };
}
