
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type SystemUserInsert = Database['public']['Tables']['system_users']['Insert'];
type SystemUserUpdate = Database['public']['Tables']['system_users']['Update'];

export const useUserManagement = () => {
  const createUser = async (userData: SystemUserInsert) => {
    const { data, error } = await supabase
      .from('system_users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateUser = async (id: string, updates: SystemUserUpdate) => {
    const { data, error } = await supabase
      .from('system_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase
      .from('system_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  const fetchUsersByRole = async (role: "student" | "staff") => {
    // Exclude sensitive columns for security
    const { data, error } = await supabase
      .from('system_users')
      .select('id, admin_id, user_code, first_name, last_name, role, status, created_at, updated_at')
      .eq('role', role)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    fetchUsersByRole,
  };
};
