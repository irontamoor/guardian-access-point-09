
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { AttendanceRecord } from './useAttendanceRecordsState';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];

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
      console.log('Editing attendance record:', editingRecord);
      const oldStatus = attendanceRecords.find(r => r.id === editingRecord.id)?.status;
      const newStatus = editingRecord.status as AttendanceStatus;

      // Update the attendance record
      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({
          status: newStatus,
          check_in_time: editingRecord.status === 'in' ? (editingRecord.check_in_time || new Date().toISOString()) : editingRecord.check_in_time,
          check_out_time: editingRecord.status === 'out' ? (editingRecord.check_out_time || new Date().toISOString()) : null,
          notes: editingRecord.notes || ''
        })
        .eq('id', editingRecord.id);

      if (updateError) {
        console.error('Error updating attendance record:', updateError);
        throw updateError;
      }

      // Log the edit - using a placeholder admin user ID since we don't have auth
      const { error: logError } = await supabase
        .from('attendance_edits')
        .insert({
          attendance_record_id: editingRecord.id,
          admin_user_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          old_status: oldStatus,
          new_status: newStatus,
          edit_reason: editReason
        });

      if (logError) {
        console.error('Error logging edit:', logError);
        // Don't throw here - the main update succeeded
      }

      toast({
        title: "Success",
        description: "Attendance record updated successfully",
        variant: "default"
      });

      setEditingRecord(null);
      setEditReason('');
      onRefresh();
    } catch (error: any) {
      console.error('Error in handleEditAttendance:', error);
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
