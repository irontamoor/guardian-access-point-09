
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generic enum fetcher. Use as: const roles = useEnumValues('app_role')
 */
export function useEnumValues(enumName: string) {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnum() {
      setLoading(true);
      try {
        // Query Postgres pg_type/pg_enum system catalog for enum values
        const { data, error } = await supabase.rpc("enum_values", { table_name: enumName });
        if (!error && Array.isArray(data)) {
          setValues(data.map(String));
        } else if (!error && Array.isArray(data)) {
          setValues(data.map(String));
        } else {
          setValues([]);
        }
      } catch {
        setValues([]);
      }
      setLoading(false);
    }
    fetchEnum();
  }, [enumName]);

  return { values, loading };
}
