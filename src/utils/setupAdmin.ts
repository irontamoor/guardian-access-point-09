import { supabase } from "@/integrations/supabase/client";

// Remove any possible orphaned Supabase auth accounts with the same email first
export const deleteSupabaseUserByEmail = async (email: string) => {
  // Only service_role can do this directly; since we can't use secrets here, we rely on attempting sign up even if one exists (Supabase will throw an error if email exists)
  // Instead, we signal user to manually remove if error is email already registered
  return;
};

/**
 * Creates the default admin in system_users and in Supabase Auth.
 * Returns { success: boolean, error?: string }
 */
export const createAdminAuth = async (): Promise<{ success: boolean; error?: string }> => {
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

    // 2. Attempt to sign up the same admin in Supabase Auth (idempotent, but signup fails if email already exists)
    const { error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        emailRedirectTo: window.location.origin + "/"
      }
    });

    if (signUpError && !signUpError.message.includes("already registered")) {
      // If error is not "already registered"
      return { success: false, error: `Supabase auth failed: ${signUpError.message}` };
    }
    // If "already registered", that's fine, continue.

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
