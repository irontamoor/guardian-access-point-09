
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Helper parsers
export const parseStudent = (user: Database["public"]["Tables"]["system_users"]["Row"]) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: user.board_type ? `Board: ${user.board_type}` : "",
  status: "absent" as "absent" | "present",
});

export const parseStaff = (user: Database["public"]["Tables"]["system_users"]["Row"]) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: user.employee_id ? `ID: ${user.employee_id}` : "",
  status: "absent" as "absent" | "present",
});

export function useSystemUsers() {
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

  return { getUsersByRole, parseStudent, parseStaff };
}
