
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AttendanceRecord } from './useAttendanceRecordsState';

export function useMassEdit() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleMassEditSubmit = useCallback(async (
    massEditStatus: "in" | "out",
    massEditReason: string,
    attendanceRecords: AttendanceRecord[],
    onRefresh: () => void
  ) => {
    if (selectedIds.length === 0 || !massEditReason.trim()) return;
    
    try {
      for (const id of selectedIds) {
        const oldStatus = attendanceRecords.find(r => r.id === id)?.status;
        
        // Update attendance record
        const { error: updateError } = await supabase
          .from('attendance_records')
          .update({
            status: massEditStatus,
            check_in_time: massEditStatus === 'in' ? new Date().toISOString() : undefined,
            check_out_time: massEditStatus === 'out' ? new Date().toISOString() : null
          })
          .eq('id', id);

        if (updateError) throw updateError;

        // Log the edit
        const { error: logError } = await supabase
          .from('attendance_edits')
          .insert({
            attendance_record_id: id,
            admin_user_id: 'admin', // TODO: Get actual admin user ID
            old_status: oldStatus,
            new_status: massEditStatus,
            edit_reason: massEditReason
          });

        if (logError) throw logError;
      }

      toast({
        title: "Success",
        description: `Updated status for ${selectedIds.length} attendance record(s).`,
      });

      setSelectedIds([]);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Mass edit failed",
        variant: "destructive"
      });
    }
  }, [selectedIds, toast]);

  const handleToggleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => 
      checked ? [...prev, id] : prev.filter(selId => selId !== id)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean, attendanceRecords: AttendanceRecord[]) => {
    setSelectedIds(checked ? attendanceRecords.map(r => r.id) : []);
  }, []);

  return {
    selectedIds,
    setSelectedIds,
    handleMassEditSubmit,
    handleToggleSelect,
    handleSelectAll,
  };
}
