
import { useEffect, useState } from 'react';
import { query } from '@/integrations/postgres/client';

interface DebugInfoProps {
  showDebug: boolean;
  onToggleDebug: () => void;
}

export function AttendanceDebugInfo({ showDebug, onToggleDebug }: DebugInfoProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function debugUser() {
      try {
        // Since we don't have auth, we'll just show database connection status
        const result = await query('SELECT COUNT(*) as count FROM system_users');
        setDebugInfo({
          databaseConnected: true,
          userCount: result.rows[0]?.count || 0,
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
