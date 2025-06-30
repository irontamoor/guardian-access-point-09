
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';
import type { AttendanceStatus, UserRole, SystemUser } from '@/integrations/postgres/types';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  notes?: string;
  system_users: {
    first_name: string;
    last_name: string;
    id: string;
    role: UserRole;
  };
}

export function useAttendanceRecordsState() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const { toast } = useToast();

  const fetchSystemUsers = useCallback(async () => {
    try {
      const result = await query('SELECT * FROM system_users');
      setSystemUsers(result.rows || []);
    } catch (error: any) {
      setSystemUsers([]);
      setDebugMessage((prev: string | null) =>
        (prev || "") + `\nFailed to load users: ${error.message}`
      );
    }
  }, []);

  const fetchAttendanceRecords = useCallback(async (selectedDate: string) => {
    setIsLoading(true);
    setFetchError(null);
    setDebugMessage(null);
    try {
      let sql = 'SELECT * FROM attendance_records';
      let params: any[] = [];

      if (selectedDate !== 'all') {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        sql += ' WHERE created_at >= $1 AND created_at < $2';
        params = [startDate.toISOString(), endDate.toISOString()];
      }

      sql += ' ORDER BY created_at DESC';

      const result = await query(sql, params);
      const data = result.rows || [];

      const merged = data.map((record: any) => {
        const sysUser = systemUsers.find(u => u.id === record.user_id);
        return {
          ...record,
          system_users: sysUser || null,
        };
      });

      setDebugMessage(
        `Fetched ${merged.length} attendance. Raw data: ${JSON.stringify(merged, null, 2)}`
      );

      setAttendanceRecords(merged);
    } catch (error: any) {
      setAttendanceRecords([]);
      setFetchError(error.message || "Failed to fetch attendance records.");
      setDebugMessage(error.stack || 'No stack');
      toast({
        title: "Error",
        description: error.message || "Failed to fetch attendance records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [systemUsers, toast]);

  return {
    attendanceRecords,
    isLoading,
    setIsLoading,
    fetchError,
    debugMessage,
    systemUsers,
    fetchSystemUsers,
    fetchAttendanceRecords,
  };
}
