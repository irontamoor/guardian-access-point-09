
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
      console.log('Attendance records data:', attendanceData);

      if (!attendanceData || attendanceData.length === 0) {
        setAttendanceRecords([]);
        setDebugMessage(selectedDate === 'all' ? 
          'No attendance records found in the database' : 
          `No attendance records found for ${selectedDate}`);
        console.log('No attendance records found');
        return;
      }

      // Get unique user IDs from attendance records
      const userIds = [...new Set(attendanceData.map(record => record.user_id).filter(Boolean))];
      console.log('Unique user IDs from attendance records:', userIds);

      // Fetch ALL system users and ALL visitors in parallel
      const [systemUsersResponse, visitorsResponse] = await Promise.all([
        supabase.from('system_users').select('id, first_name, last_name, user_code, admin_id, role'),
        supabase.from('visitors').select('id, first_name, last_name, organization, visit_purpose')
      ]);

      if (systemUsersResponse.error) {
        console.error('Error fetching system users:', systemUsersResponse.error);
      }
      
      if (visitorsResponse.error) {
        console.error('Error fetching visitors:', visitorsResponse.error);
      }

      const allSystemUsers = systemUsersResponse.data || [];
      const allVisitors = visitorsResponse.data || [];

      console.log('All system users found:', allSystemUsers.length);
      console.log('All visitors found:', allVisitors.length);
      console.log('All visitors data:', allVisitors);

      // Create lookup maps for better performance
      const systemUsersMap = new Map(allSystemUsers.map(user => [user.id, user]));
      const visitorsMap = new Map(allVisitors.map(visitor => [visitor.id, visitor]));

      console.log('System users map keys:', Array.from(systemUsersMap.keys()));
      console.log('Visitors map keys:', Array.from(visitorsMap.keys()));

      // Combine the data
      const enrichedRecords = attendanceData.map(record => {
        const systemUser = systemUsersMap.get(record.user_id);
        const visitor = visitorsMap.get(record.user_id);
        
        console.log(`Record ${record.id}: user_id=${record.user_id}, systemUser=${!!systemUser}, visitor=${!!visitor}`);
        
        return {
          ...record,
          system_users: systemUser || null,
          visitors: visitor || null
        };
      });

      console.log('Final enriched attendance records:', enrichedRecords.length);
      console.log('Enriched records data:', enrichedRecords);
      
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
    fetchSystemUsers,
    fetchAttendanceRecords,
  };
}
