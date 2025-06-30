
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSystemUsersData() {
  const getUsersByRole = useCallback(async (role: "student" | "staff") => {
    const { data, error } = await supabase
      .from('system_users')
      .select('*')
      .eq('role', role)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, []);

  return { getUsersByRole };
}
