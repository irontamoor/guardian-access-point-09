
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';
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
      await query('BEGIN');

      for (const id of selectedIds) {
        const oldStatus = attendanceRecords.find(r => r.id === id)?.status;
        
        await query(
          `UPDATE attendance_records SET 
           status = $1, 
           check_in_time = $2, 
           check_out_time = $3 
           WHERE id = $4`,
          [
            massEditStatus,
            massEditStatus === 'in' ? new Date().toISOString() : undefined,
            massEditStatus === 'out' ? new Date().toISOString() : null,
            id
          ]
        );

        await query(
          `INSERT INTO attendance_edits (attendance_record_id, old_status, new_status, edit_reason) 
           VALUES ($1, $2, $3, $4)`,
          [id, oldStatus, massEditStatus, massEditReason]
        );
      }

      await query('COMMIT');

      toast({
        title: "Success",
        description: `Updated status for ${selectedIds.length} attendance record(s).`,
      });

      setSelectedIds([]);
      onRefresh();
    } catch (error: any) {
      await query('ROLLBACK');
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
