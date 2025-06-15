
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SignInOption = {
  id: string;
  label: string;
  applies_to: "staff" | "student" | "both";
  is_active: boolean;
  category: "sign_in" | "pickup_type";
};

export const useSignInOptions = (
  appliesTo: "staff" | "student" | "both" = "both",
  category: "sign_in" | "pickup_type" = "sign_in"
) => {
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
      .eq("category", category)
      .or(`applies_to.eq.${appliesTo},applies_to.eq.both`);
    if (error) setError(error.message);

    // Remap to satisfy type guard
    // Ensure applies_to and category fields are correct types
    setOptions(
      (data || []).map((row) => ({
        id: row.id,
        label: row.label,
        applies_to:
          row.applies_to === "staff"
            ? "staff"
            : row.applies_to === "student"
            ? "student"
            : "both",
        is_active: !!row.is_active,
        category: row.category === "pickup_type" ? "pickup_type" : "sign_in",
      }))
    );
    setLoading(false);
  };

  const addOption = async (
    label: string,
    applies_to: "staff" | "student" | "both" = "both",
    category: "sign_in" | "pickup_type" = "sign_in"
  ) => {
    const { error } = await supabase.from("sign_in_options").insert([
      { label, applies_to, category },
    ]);
    if (!error) await fetchOptions();
    return error;
  };

  const deactivateOption = async (id: string) => {
    const { error } = await supabase
      .from("sign_in_options")
      .update({ is_active: false })
      .eq("id", id);
    if (!error) await fetchOptions();
    return error;
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliesTo, category]);

  return { options, loading, error, addOption, deactivateOption, fetchOptions };
};
