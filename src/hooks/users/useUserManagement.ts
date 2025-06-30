
import { query } from "@/integrations/postgres/client";
import type { SystemUser } from "@/integrations/postgres/types";

type SystemUserInsert = Omit<SystemUser, 'id' | 'created_at' | 'updated_at'>;
type SystemUserUpdate = Partial<SystemUserInsert>;

export const useUserManagement = () => {
  const createUser = async (userData: SystemUserInsert) => {
    const result = await query(
      `INSERT INTO system_users (first_name, last_name, email, phone, role, status, user_code, admin_id, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone,
        userData.role,
        userData.status,
        userData.user_code,
        userData.admin_id,
        userData.password
      ]
    );
    
    if (result.rows.length === 0) throw new Error('Failed to create user');
    return result.rows[0];
  };

  const updateUser = async (id: string, updates: SystemUserUpdate) => {
    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [id, ...Object.values(updates)];
    
    const result = await query(
      `UPDATE system_users SET ${updateFields}, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) throw new Error('User not found');
    return result.rows[0];
  };

  const deleteUser = async (id: string) => {
    const result = await query(
      "DELETE FROM system_users WHERE id = $1",
      [id]
    );
    
    if (result.rowCount === 0) throw new Error('User not found');
  };

  const fetchUsersByRole = async (role: "student" | "staff") => {
    const result = await query(
      "SELECT * FROM system_users WHERE role = $1 AND status = $2 ORDER BY created_at DESC",
      [role, 'active']
    );
    
    return result.rows || [];
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    fetchUsersByRole,
  };
};
