
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';
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
      await query(
        `INSERT INTO attendance_edits (attendance_record_id, old_status, new_status, edit_reason) 
         VALUES ($1, $2, $3, $4)`,
        [editingRecord.id, editingRecord.status, editingRecord.status, editReason]
      );

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
        await query(
          `INSERT INTO attendance_edits (attendance_record_id, old_status, new_status, edit_reason) 
           VALUES ($1, $2, $3, $4)`,
          [record.id, record.status, massEditStatus, massEditReason]
        );
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
