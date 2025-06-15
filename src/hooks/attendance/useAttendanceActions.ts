
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AttendanceRecord } from './useAttendanceRecordsState';

export function useAttendanceActions() {
  const { toast } = useToast();

  const handleEditAttendance = useCallback(async (
    editingRecord: AttendanceRecord | null,
    editReason: string,
    onSuccess: () => void
  ) => {
    if (!editingRecord) return;

    try {
      const { error } = await supabase
        .from('attendance_edits')
        .insert({
          attendance_record_id: editingRecord.id,
          admin_user_id: editingRecord.user_id, // Should be current admin user
          old_status: editingRecord.status,
          new_status: editingRecord.status,
          edit_reason: editReason
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance record updated successfully",
        variant: "default"
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance record",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleMassEdit = useCallback(async (
    selectedIds: Set<string>,
    massEditStatus: "in" | "out",
    massEditReason: string,
    records: AttendanceRecord[],
    onSuccess: () => void
  ) => {
    if (selectedIds.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one record",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedRecords = records.filter(r => selectedIds.has(r.id));
      
      for (const record of selectedRecords) {
        const { error } = await supabase
          .from('attendance_edits')
          .insert({
            attendance_record_id: record.id,
            admin_user_id: record.user_id, // Should be current admin user
            old_status: record.status,
            new_status: massEditStatus,
            edit_reason: massEditReason
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Updated ${selectedIds.size} attendance records`,
        variant: "default"
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance records",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    handleEditAttendance,
    handleMassEdit,
  };
}
