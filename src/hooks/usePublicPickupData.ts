import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PublicPickupRecord {
  id: string;
  student_id: string;
  student_name?: string;
  parent_guardian_name: string;
  relationship: string;
  action_time: string;
  approved: boolean;
}

export function usePublicPickupData() {
  const [records, setRecords] = useState<PublicPickupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRecords = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfDay = `${today}T00:00:00.000Z`;
      const endOfDay = `${today}T23:59:59.999Z`;

      const { data, error } = await supabase
        .from('parent_pickup_records')
        .select('id, student_id, student_name, parent_guardian_name, relationship, action_time, approved')
        .eq('action_type', 'pickup')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('action_time', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching pickup records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRecords, 30000);

    // Set up realtime subscription
    const channel = supabase
      .channel('pickup-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parent_pickup_records',
          filter: 'action_type=eq.pickup'
        },
        () => {
          fetchRecords();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    records,
    isLoading,
    lastUpdated,
    refresh: fetchRecords
  };
}
