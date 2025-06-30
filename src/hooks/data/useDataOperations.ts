
import { query } from "@/integrations/postgres/client";

export function useDataOperations() {
  const addStudent = async (studentData: { id: string; name: string; grade: string }) => {
    const { id, name, grade } = studentData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    
    await query(
      'INSERT INTO system_users (id, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5)',
      [id, first_name, last_name, 'student', 'active']
    );
  };

  const addStaff = async (staffData: { id: string; name: string; department: string }) => {
    const { id, name, department } = staffData;
    const first_name = name.split(" ")[0] || name;
    const last_name = name.split(" ").slice(1).join(" ") || ".";
    
    await query(
      'INSERT INTO system_users (id, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5)',
      [id, first_name, last_name, 'staff', 'active']
    );
  };

  return {
    addStudent,
    addStaff,
  };
}
