import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VisitorRecord {
  id: string;
  first_name: string;
  last_name: string;
  organization?: string;
  visit_purpose: string;
  host_name?: string;
  phone_number?: string;
  notes?: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'in' | 'out';
  created_at: string;
  updated_at: string;
}

export function useVisitorRecordsData() {
  const [records, setRecords] = useState<VisitorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (selectedDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('visitor_records')
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
      setError(err instanceof Error ? err.message : 'Failed to fetch visitor records');
      console.error('Error fetching visitor records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<VisitorRecord>) => {
    try {
      const { error: updateError } = await supabase
        .from('visitor_records')
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
        .from('visitor_records')
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
    const today = new Date().toISOString().split('T')[0];
    fetchRecords(today);
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