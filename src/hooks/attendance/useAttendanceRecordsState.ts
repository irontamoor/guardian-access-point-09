
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];
type UserRole = Database['public']['Enums']['user_role'];

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
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchSystemUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*');
      if (error) throw error;
      setSystemUsers(data || []);
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
      let query = supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedDate !== 'all') {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const merged = (data || []).map((record: any) => {
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
