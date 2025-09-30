
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];

// Safe user type without sensitive fields (password, email, phone)
export type SafeSystemUser = Pick<SystemUser, 
  'id' | 'admin_id' | 'user_code' | 'first_name' | 'last_name' | 
  'role' | 'status' | 'created_at' | 'updated_at'
>;

export const parseStudent = (user: SafeSystemUser) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  grade: "",
  status: "absent" as "absent" | "present",
});

export const parseStaff = (user: SafeSystemUser) => ({
  id: user.id,
  name: `${user.first_name} ${user.last_name}`,
  department: "",
  status: "absent" as "absent" | "present",
});
