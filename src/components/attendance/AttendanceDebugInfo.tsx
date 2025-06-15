
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DebugInfoProps {
  showDebug: boolean;
  onToggleDebug: () => void;
}

export function AttendanceDebugInfo({ showDebug, onToggleDebug }: DebugInfoProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function debugUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      let sysUser = null;
      let roleRow = null;
      if (user) {
        const { data: sysUserData } = await supabase
          .from("system_users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        sysUser = sysUserData;

        const { data: roleRowData } = await supabase
          .from("user_role_assignments")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "admin");
        roleRow = roleRowData;
      }
      setDebugInfo({
        supabaseUser: user,
        supabaseUserError: error,
        systemUser: sysUser,
        adminRoleAssignments: roleRow,
      });
    }
    debugUser();
  }, []);

  return (
    <div className="mb-2">
      <button
        className="text-xs text-gray-500 underline mb-1"
        onClick={onToggleDebug}
        type="button"
      >
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </button>
      {showDebug && (
        <div className="bg-gray-100 border rounded p-3 mb-2 text-xs max-w-full overflow-x-auto">
          <div>
            <strong>Supabase User:</strong>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUser, null, 2)}</pre>
          </div>
          <div>
            <strong>Supabase User Error:</strong>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUserError, null, 2)}</pre>
          </div>
          <div>
            <strong>System User (system_users row):</strong>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.systemUser, null, 2)}</pre>
          </div>
          <div>
            <strong>Admin Role Assignments:</strong>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.adminRoleAssignments, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
