
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SignInOption = {
  id: string;
  label: string;
  applies_to: "staff" | "student" | "both";
  is_active: boolean;
};

export const useSignInOptions = (appliesTo: "staff" | "student" | "both" = "both") => {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("sign_in_options")
      .select("*")
      .eq("is_active", true)
      .or(`applies_to.eq.${appliesTo},applies_to.eq.both`);
    if (error) setError(error.message);
    setOptions(data || []);
    setLoading(false);
  };

  const addOption = async (label: string, applies_to: "staff" | "student" | "both" = "both") => {
    const { error } = await supabase.from("sign_in_options").insert([
      { label, applies_to }
    ]);
    if (!error) await fetchOptions();
    return error;
  };

  const deactivateOption = async (id: string) => {
    const { error } = await supabase.from("sign_in_options").update({ is_active: false }).eq("id", id);
    if (!error) await fetchOptions();
    return error;
  };

  useEffect(() => { fetchOptions(); }, [appliesTo]);

  return { options, loading, error, addOption, deactivateOption, fetchOptions };
};
