
import { useCallback } from "react";
import { query } from "@/integrations/postgres/client";

export function useSystemUsersData() {
  const getUsersByRole = useCallback(async (role: "student" | "staff") => {
    const result = await query(
      "SELECT * FROM system_users WHERE role = $1 AND status = $2 ORDER BY created_at DESC",
      [role, 'active']
    );
    return result.rows || [];
  }, []);

  return { getUsersByRole };
}
