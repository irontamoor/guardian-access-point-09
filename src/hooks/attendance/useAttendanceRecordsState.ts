
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  status: 'in' | 'out';
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  notes?: string;
  system_users?: {
    id: string;
    first_name: string;
    last_name: string;
    user_code?: string;
    role: string;
  } | null;
  visitors?: {
    id: string;
    first_name: string;
    last_name: string;
    organization?: string;
    visit_purpose: string;
  } | null;
}

export function useAttendanceRecordsState() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState('');
  const { toast } = useToast();

  const fetchSystemUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('system_users').select('*');
      if (error) throw error;
      console.log('System users loaded:', data?.length || 0);
    } catch (error: any) {
      console.error('Error fetching system users:', error);
    }
  }, []);

  const fetchAttendanceRecords = useCallback(async (selectedDate: string = 'all') => {
    setIsLoading(true);
    setFetchError(null);
    setDebugMessage('');

    try {
      console.log('Fetching attendance records for date:', selectedDate);

      let query = supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply date filter if not 'all'
      if (selectedDate !== 'all') {
        const startOfDay = `${selectedDate}T00:00:00.000Z`;
        const endOfDay = `${selectedDate}T23:59:59.999Z`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
      }

      const { data: attendanceData, error: attendanceError } = await query;

      if (attendanceError) {
        throw attendanceError;
      }

      console.log('Raw attendance data:', attendanceData?.length || 0, 'records');

      if (!attendanceData || attendanceData.length === 0) {
        setAttendanceRecords([]);
        setDebugMessage('No attendance records found');
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(attendanceData.map(record => record.user_id))];
      console.log('Unique user IDs:', userIds.length);

      // Fetch system users
      const { data: systemUsers, error: usersError } = await supabase
        .from('system_users')
        .select('id, first_name, last_name, user_code, role')
        .in('id', userIds);

      if (usersError) {
        console.error('Error fetching system users:', usersError);
      }

      // Fetch visitors
      const { data: visitors, error: visitorsError } = await supabase
        .from('visitors')
        .select('id, first_name, last_name, organization, visit_purpose')
        .in('id', userIds);

      if (visitorsError) {
        console.error('Error fetching visitors:', visitorsError);
      }

      console.log('System users found:', systemUsers?.length || 0);
      console.log('Visitors found:', visitors?.length || 0);

      // Combine the data
      const enrichedRecords = attendanceData.map(record => {
        const systemUser = systemUsers?.find(user => user.id === record.user_id);
        const visitor = visitors?.find(v => v.id === record.user_id);
        
        return {
          ...record,
          system_users: systemUser || null,
          visitors: visitor || null
        };
      });

      setAttendanceRecords(enrichedRecords);
      setDebugMessage(`Successfully loaded ${enrichedRecords.length} attendance records`);

    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      setFetchError(error.message);
      toast({
        title: "Error",
        description: `Failed to fetch attendance records: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    attendanceRecords,
    isLoading,
    setIsLoading,
    fetchError,
    debugMessage,
    fetchSystemUsers,
    fetchAttendanceRecords,
  };
}
