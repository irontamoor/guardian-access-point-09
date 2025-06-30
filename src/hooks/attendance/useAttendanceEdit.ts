
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';
import type { AttendanceStatus } from '@/integrations/postgres/types';
import type { AttendanceRecord } from './useAttendanceRecordsState';

export function useAttendanceEdit() {
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editReason, setEditReason] = useState('');
  const { toast } = useToast();

  const handleEditAttendance = useCallback(async (
    attendanceRecords: AttendanceRecord[],
    onRefresh: () => void
  ) => {
    if (!editingRecord || !editReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the edit",
        variant: "destructive"
      });
      return;
    }

    try {
      const oldStatus = attendanceRecords.find(r => r.id === editingRecord.id)?.status;
      const newStatus = editingRecord.status as AttendanceStatus;

      await query(
        `UPDATE attendance_records SET 
         status = $1, 
         check_in_time = $2, 
         check_out_time = $3, 
         notes = $4 
         WHERE id = $5`,
        [
          newStatus,
          editingRecord.status === 'in' ? (editingRecord.check_in_time || new Date().toISOString()) : editingRecord.check_in_time,
          editingRecord.status === 'out' ? (editingRecord.check_out_time || new Date().toISOString()) : null,
          editingRecord.notes,
          editingRecord.id
        ]
      );

      // Log the edit
      await query(
        `INSERT INTO attendance_edits (attendance_record_id, old_status, new_status, edit_reason) 
         VALUES ($1, $2, $3, $4)`,
        [editingRecord.id, oldStatus, newStatus, editReason]
      );

      toast({
        title: "Success",
        description: "Attendance record updated successfully",
        variant: "default"
      });

      setEditingRecord(null);
      setEditReason('');
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance record",
        variant: "destructive"
      });
    }
  }, [editingRecord, editReason, toast]);

  return {
    editingRecord,
    setEditingRecord,
    editReason,
    setEditReason,
    handleEditAttendance,
  };
}
