
import { supabase } from '@/integrations/supabase/client';

export const createAdminAuth = async () => {
  try {
    // Create auth user for the admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@school.com',
      password: 'admin123',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (authError && authError.message !== 'User already registered') {
      throw authError;
    }

    // Get the system user ID for the admin
    const { data: systemUser, error: userError } = await supabase
      .from('system_users')
      .select('id')
      .eq('email', 'admin@school.com')
      .single();

    if (userError) throw userError;

    // Create role assignment
    const { error: roleError } = await supabase
      .from('user_role_assignments')
      .insert({
        user_id: systemUser.id,
        role: 'admin'
      });

    if (roleError && !roleError.message.includes('duplicate key value')) {
      throw roleError;
    }

    console.log('Admin user setup completed successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error setting up admin:', error);
    return { success: false, error: error.message };
  }
};
