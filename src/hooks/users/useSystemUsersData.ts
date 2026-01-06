import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSystemUsersData() {
  const getUsersByRole = useCallback(async (role: "student" | "staff") => {
    // Use dedicated tables for public kiosk access (no PII exposure)
    if (role === "student") {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, status, created_at, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        user_code: s.student_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'student' as const,
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at
      }));
    } else {
      const { data, error } = await supabase
        .from('staff')
        .select('id, employee_id, first_name, last_name, status, created_at, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        user_code: s.employee_id,
        first_name: s.first_name,
        last_name: s.last_name,
        role: 'staff' as const,
        status: s.status,
        created_at: s.created_at,
        updated_at: s.updated_at
      }));
    }
  }, []);

  return { getUsersByRole };
}
