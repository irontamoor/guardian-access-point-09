import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PickupStatus = 'pending_approval' | 'getting_ready' | 'approved_to_leave' | 'issue_call_supervisor';

export interface PickupStatusResult {
  id: string;
  student_id: string;
  student_name?: string;
  parent_guardian_name: string;
  relationship: string;
  action_time: string;
  approved: boolean;
  pickup_status: PickupStatus;
  pickup_type?: string;
  notes?: string;
}

export interface StatusConfig {
  color: string;
  icon: string;
  label: string;
  description: string;
}

export function getStatusConfig(status: PickupStatus): StatusConfig {
  const configs: Record<PickupStatus, StatusConfig> = {
    'pending_approval': {
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: 'Clock',
      label: 'Pending Approval',
      description: 'Awaiting staff approval'
    },
    'getting_ready': {
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: 'AlertCircle',
      label: 'Getting Ready',
      description: 'Student is being prepared / waiting permission to leave'
    },
    'approved_to_leave': {
      color: 'bg-green-500 hover:bg-green-600',
      icon: 'CheckCircle2',
      label: 'Approved - Student Coming',
      description: 'Student is approved and coming to pickup area'
    },
    'issue_call_supervisor': {
      color: 'bg-red-500 hover:bg-red-600',
      icon: 'AlertTriangle',
      label: 'Issue - Call Supervisor',
      description: 'Problem detected, supervisor assistance needed'
    }
  };
  return configs[status];
}

export function usePickupStatusLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PickupStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookupStatus = async (studentId: string) => {
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfDay = `${today}T00:00:00.000Z`;
      const endOfDay = `${today}T23:59:59.999Z`;

      const { data, error: queryError } = await supabase
        .from('parent_pickup_records')
        .select('id, student_id, student_name, parent_guardian_name, relationship, action_time, approved, pickup_status, pickup_type, notes')
        .eq('student_id', studentId.trim())
        .eq('action_type', 'pickup')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('action_time', { ascending: false })
        .limit(1);

      if (queryError) throw queryError;

      if (!data || data.length === 0) {
        setError('No pickup record found for this student today');
        return;
      }

      setResult(data[0]);
    } catch (err) {
      console.error('Error looking up pickup status:', err);
      setError('Failed to lookup pickup status');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    lookupStatus,
    reset,
    isLoading,
    result,
    error
  };
}
