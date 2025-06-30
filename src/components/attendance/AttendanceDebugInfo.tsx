
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
      try {
        const { count, error } = await supabase
          .from('system_users')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;

        setDebugInfo({
          databaseConnected: true,
          userCount: count || 0,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        setDebugInfo({
          databaseConnected: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
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
            <strong>Database Connection:</strong>
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
