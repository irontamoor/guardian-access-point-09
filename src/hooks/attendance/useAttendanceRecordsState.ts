
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

      console.log('Attendance records found:', attendanceData?.length || 0);

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

      // Fetch ALL system users first
      const { data: allSystemUsers, error: allSystemUsersError } = await supabase
        .from('system_users')
        .select('id, first_name, last_name, user_code, admin_id, role');

      if (allSystemUsersError) {
        console.error('Error fetching all system users:', allSystemUsersError);
      }

      const systemUsers = allSystemUsers || [];
      console.log('All system users found:', systemUsers.length);

      // Filter system users that match our attendance records
      const matchingSystemUsers = systemUsers.filter(user => userIds.includes(user.id));
      console.log('Matching system users found:', matchingSystemUsers.length);

      // Get visitor IDs (those not found in system_users)
      const systemUserIds = matchingSystemUsers.map(u => u.id);
      const visitorIds = userIds.filter(id => !systemUserIds.includes(id));
      console.log('Visitor IDs to fetch:', visitorIds);

      // Fetch ALL visitors first, then filter
      const { data: allVisitors, error: allVisitorsError } = await supabase
        .from('visitors')
        .select('id, first_name, last_name, organization, visit_purpose');

      if (allVisitorsError) {
        console.error('Error fetching all visitors:', allVisitorsError);
      }

      const visitors = allVisitors || [];
      console.log('All visitors found:', visitors.length);

      // Filter visitors that match our attendance records
      const matchingVisitors = visitors.filter(visitor => visitorIds.includes(visitor.id));
      console.log('Matching visitors found:', matchingVisitors.length);

      // Combine the data
      const enrichedRecords = attendanceData.map(record => {
        const systemUser = matchingSystemUsers.find(user => user.id === record.user_id);
        const visitor = matchingVisitors.find(v => v.id === record.user_id);
        
        console.log(`Record ${record.id}: user_id=${record.user_id}, systemUser=${!!systemUser}, visitor=${!!visitor}`);
        
        return {
          ...record,
          system_users: systemUser || null,
          visitors: visitor || null
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
    fetchSystemUsers,
    fetchAttendanceRecords,
  };
}
