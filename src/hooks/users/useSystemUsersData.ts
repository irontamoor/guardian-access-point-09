
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSystemUsersData() {
  // Fetch system users by role
  const getUsersByRole = useCallback(async (role: "student" | "staff") => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("role", role)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  return { getUsersByRole };
}
