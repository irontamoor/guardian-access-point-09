
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];

export const parseStudent = (user: SystemUser) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: "",
  status: "absent" as "absent" | "present",
});

export const parseStaff = (user: SystemUser) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: "",
  status: "absent" as "absent" | "present",
});
