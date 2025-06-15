
import type { Database } from "@/integrations/supabase/types";

// Helper parsers
export const parseStudent = (user: Database["public"]["Tables"]["system_users"]["Row"]) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: "",  // Placeholder if UI expects it, otherwise you can remove wherever used
  status: "absent" as "absent" | "present",
});

export const parseStaff = (user: Database["public"]["Tables"]["system_users"]["Row"]) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: "", // Removed employee_id, use empty string or id as needed
  status: "absent" as "absent" | "present",
});
