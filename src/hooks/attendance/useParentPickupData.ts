import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Get admin_id from localStorage session for secure RPC calls
const getAdminId = (): string | null => {
  try {
    const sessionData = localStorage.getItem('admin_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      return session.admin_id || null;
    }
  } catch {
    return null;
  }
  return null;
};

export interface ParentPickupRecord {
  id: string;
  student_id: string;
  student_name?: string;
  parent_guardian_name: string;
  relationship: string;
  pickup_type?: string;
  action_type: 'pickup' | 'dropoff';
  notes?: string;
  photo_url?: string | null;
  action_time: string;
  approved: boolean;
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
      setRecords((data || []).map(record => ({
        ...record,
        action_type: record.action_type as 'pickup' | 'dropoff'
      })));
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
      const adminId = getAdminId();
      if (!adminId) {
        throw new Error('Admin credentials required to delete records');
      }

      const { error: deleteError } = await supabase.rpc('admin_delete_parent_pickup_record', {
        p_admin_id: adminId,
        p_record_id: id
      });

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