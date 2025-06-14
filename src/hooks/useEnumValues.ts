
import { useEffect, useState } from "react";
import { Constants } from "@/integrations/supabase/types";

/**
 * Fetches static enum values exported from Supabase types.
 * Usage: const { values, loading } = useEnumValues('app_role');
 */
export function useEnumValues(enumName: "app_role") {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Only support 'app_role' for now; expand logic if more enums needed.
    if (enumName === "app_role") {
      setValues(Constants.public.Enums.app_role.slice());
    } else {
      setValues([]);
    }
    setLoading(false);
  }, [enumName]);

  return { values, loading };
}
