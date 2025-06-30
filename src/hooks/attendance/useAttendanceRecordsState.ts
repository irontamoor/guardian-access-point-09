
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
  company?: string;
  host_name?: string;
  purpose?: string;
  // New fields from merged structure
  first_name?: string;
  last_name?: string;
  organization?: string;
  visit_purpose?: string;
  phone_number?: string;
  // Optional system user data for existing records
  system_users?: {
    id: string;
    first_name: string;
    last_name: string;
    user_code?: string;
    role: string;
  } | null;
}

export function useAttendanceRecordsState() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState('');
  const { toast } = useToast();

  const fetchAttendanceRecords = useCallback(async (selectedDate: string = 'all') => {
    setIsLoading(true);
    setFetchError(null);
    setDebugMessage('');

    try {
      console.log('Fetching attendance records for date:', selectedDate);

      // Build the query for attendance records
      let query = supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply date filter if not 'all'
      if (selectedDate !== 'all') {
        const startOfDay = `${selectedDate}T00:00:00.000Z`;
        const endOfDay = `${selectedDate}T23:59:59.999Z`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
        console.log('Applying date filter:', startOfDay, 'to', endOfDay);
      }

      const { data: attendanceData, error: attendanceError } = await query;

      if (attendanceError) {
        console.error('Error fetching attendance data:', attendanceError);
        throw attendanceError;
      }

      console.log('Raw attendance records found:', attendanceData?.length || 0);

      if (!attendanceData || attendanceData.length === 0) {
        setAttendanceRecords([]);
        setDebugMessage(selectedDate === 'all' ? 
          'No attendance records found in the database' : 
          `No attendance records found for ${selectedDate}`);
        return;
      }

      // For records that don't have first_name/last_name, try to get from system_users
      const userIds = [...new Set(
        attendanceData
          .filter(record => !record.first_name || !record.last_name)
          .map(record => record.user_id)
          .filter(Boolean)
      )];

      let systemUsersMap = new Map();
      if (userIds.length > 0) {
        const { data: systemUsers } = await supabase
          .from('system_users')
          .select('id, first_name, last_name, user_code, admin_id, role')
          .in('id', userIds);

        if (systemUsers) {
          systemUsersMap = new Map(systemUsers.map(user => [user.id, user]));
        }
      }

      // Enrich records with system user data where needed
      const enrichedRecords = attendanceData.map(record => {
        const systemUser = systemUsersMap.get(record.user_id);
        
        return {
          ...record,
          // Use merged data first, fall back to system user data
          first_name: record.first_name || systemUser?.first_name,
          last_name: record.last_name || systemUser?.last_name,
          system_users: systemUser || null
        };
      });

      console.log('Final enriched attendance records:', enrichedRecords.length);
      setAttendanceRecords(enrichedRecords);
      setDebugMessage(`Successfully loaded ${enrichedRecords.length} attendance records`);

    } catch (error: any) {
      console.error('Error in fetchAttendanceRecords:', error);
      setFetchError(error.message);
      setAttendanceRecords([]);
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
    fetchAttendanceRecords,
  };
}
