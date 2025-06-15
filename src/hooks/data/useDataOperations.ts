
import { supabase } from "@/integrations/supabase/client";

export function useDataOperations() {
  // Add student (system_users)
  const addStudent = async (studentData: { id: string; name: string; grade: string }) => {
    const { id, name, grade } = studentData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
      id,
      first_name,
      last_name,
      role: 'student'
    });
    if (error) throw error;
  };

  // Add staff (system_users)
  const addStaff = async (staffData: { id: string; name: string; department: string }) => {
    const { id, name, department } = staffData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    const { error } = await supabase.from('system_users').insert({
      id,
      first_name,
      last_name,
      role: 'staff'
    });
    if (error) throw error;
  };

  return {
    addStudent,
    addStaff,
  };
}
