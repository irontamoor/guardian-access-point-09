import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StaffAttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  status: 'in' | 'out';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useStaffAttendanceData() {
  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (selectedDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('staff_attendance')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedDate && selectedDate !== 'all') {
        const startOfDay = `${selectedDate}T00:00:00.000Z`;
        const endOfDay = `${selectedDate}T23:59:59.999Z`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff attendance records');
      console.error('Error fetching staff attendance:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<StaffAttendanceRecord>) => {
    try {
      const { error: updateError } = await supabase
        .from('staff_attendance')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      
      fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
      throw err;
    }
  }, [fetchRecords]);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('staff_attendance')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
      throw err;
    }
  }, [fetchRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    isLoading,
    error,
    fetchRecords,
    updateRecord,
    deleteRecord,
  };
}