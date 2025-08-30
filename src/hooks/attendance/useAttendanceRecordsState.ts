
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Legacy interface for backward compatibility
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
  first_name?: string;
  last_name?: string;
  organization?: string;
  visit_purpose?: string;
  phone_number?: string;
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
    // This function is deprecated since we moved to dedicated tables
    // The new tabbed system uses dedicated hooks for each table type
    console.warn('useAttendanceRecordsState.fetchAttendanceRecords is deprecated. Use dedicated table hooks instead.');
    
    setIsLoading(true);
    setFetchError(null);
    setDebugMessage('This function is deprecated. Use the new tabbed system instead.');
    
    // Return empty results to prevent crashes
    setAttendanceRecords([]);
    setIsLoading(false);
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
