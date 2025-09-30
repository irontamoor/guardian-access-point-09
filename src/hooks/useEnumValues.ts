
import { useEffect, useState } from "react";

const APP_ROLES = ['admin', 'staff_admin', 'staff', 'student', 'parent', 'visitor', 'reader'];

export function useEnumValues(enumName: "app_role") {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (enumName === "app_role") {
      // Filter out 'moderator' and 'user' - they don't exist in our roles
      setValues(APP_ROLES);
    } else {
      setValues([]);
    }
    setLoading(false);
  }, [enumName]);

  return { values, loading };
}
