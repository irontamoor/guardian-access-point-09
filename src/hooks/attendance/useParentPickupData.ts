import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ParentPickupRecord {
  id: string;
  student_id: string;
  student_name?: string;
  parent_guardian_name: string;
  relationship: string;
  pickup_type?: string;
  action_type: 'pickup' | 'dropoff';
  notes?: string;
  action_time: string;
  created_at: string;
  updated_at: string;
}

export function useParentPickupData() {
  const [records, setRecords] = useState<ParentPickupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (selectedDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('parent_pickup_records')
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
      setError(err instanceof Error ? err.message : 'Failed to fetch parent pickup records');
      console.error('Error fetching parent pickup records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, updates: Partial<ParentPickupRecord>) => {
    try {
      const { error: updateError } = await supabase
        .from('parent_pickup_records')
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
        .from('parent_pickup_records')
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