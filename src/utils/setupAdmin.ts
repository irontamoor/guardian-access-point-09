
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures the demo account exists in Supabase Auth.
 * Returns the email and password for the demo user.
 */
export const ensureDemoUser = async (): Promise<{ email: string; password: string }> => {
  const demoEmail = "demo@school.com";
  const demoPassword = "demo12345";

  // Try to sign up the demo user; ignore error if already registered
  await supabase.auth.signUp({
    email: demoEmail,
    password: demoPassword,
    options: { emailRedirectTo: window?.location?.origin || "/" },
  });

  return { email: demoEmail, password: demoPassword };
};
