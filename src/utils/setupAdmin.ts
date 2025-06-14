
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates (or updates) the default admin in system_users and in Supabase Auth.
 * If the user exists, triggers a password reset email to admin@school.com.
 */
export const createAdminAuth = async (): Promise<{ success: boolean; error?: string; resetEmail?: boolean }> => {
  const adminEmail = "admin@school.com";
  const adminPassword = "admin123";

  try {
    // 1. Ensure admin record in system_users (safe because ON CONFLICT DO NOTHING)
    const { error: userTableError } = await supabase.from("system_users").insert([
      {
        first_name: "Admin",
        last_name: "User",
        email: adminEmail,
        role: "admin",
        status: "active",
        employee_id: "EMP001"
      }
    ]);

    if (userTableError && userTableError.code !== "23505" && !userTableError.message.includes("duplicate")) {
      return { success: false, error: `System user insert failed: ${userTableError.message}` };
    }

    // 2. Try to sign up
    const { error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: window.location.origin + "/"
      }
    });

    if (!signUpError) {
      // Signup worked; user may need to confirm email from invite
      return { success: true };
    }

    // If the error says 'already registered', fire password reset email
    if (signUpError.message && signUpError.message.toLowerCase().includes("already registered")) {
      // Send password reset email to admin@school.com
      const { error: pwResetError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: window.location.origin + "/"
      });
      if (pwResetError) {
        return { success: false, error: pwResetError.message };
      }
      return { success: false, resetEmail: true, error: "User already registered; password reset email sent." };
    }

    // Any other error
    return { success: false, error: `Supabase auth failed: ${signUpError.message}` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
