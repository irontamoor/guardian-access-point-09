
import { useState, useEffect, useCallback } from 'react';
import { useAttendanceRecordsState } from './attendance/useAttendanceRecordsState';
import { useAttendanceEdit } from './attendance/useAttendanceEdit';
import { useAttendanceFilters } from './attendance/useAttendanceFilters';
import { useAttendanceSelection } from './attendance/useAttendanceSelection';
import { useAttendanceActions } from './attendance/useAttendanceActions';

export function useAttendanceManagement() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    attendanceRecords,
    isLoading: recordsLoading,
    setIsLoading: setRecordsLoading,
    fetchError,
    debugMessage,
    fetchSystemUsers,
    fetchAttendanceRecords,
  } = useAttendanceRecordsState();

  const {
    editingRecord,
    setEditingRecord,
    editReason,
    setEditReason,
  } = useAttendanceEdit();

  const { selectedDate, setSelectedDate } = useAttendanceFilters();
  const { selectedIds, handleToggleSelect, handleSelectAll, clearSelection } = useAttendanceSelection();
  const { handleEditAttendance: handleEdit, handleMassEdit } = useAttendanceActions();

  const refreshAttendance = useCallback(() => {
    fetchAttendanceRecords(selectedDate);
  }, [fetchAttendanceRecords, selectedDate]);

  const handleEditAttendance = useCallback(async () => {
    setIsLoading(true);
    await handleEdit(editingRecord, editReason, () => {
      setEditingRecord(null);
      setEditReason('');
      refreshAttendance();
    });
    setIsLoading(false);
  }, [handleEdit, editingRecord, editReason, refreshAttendance, setEditingRecord, setEditReason]);

  const handleMassEditSubmit = useCallback(async (massEditStatus: "in" | "out", massEditReason: string) => {
    setIsLoading(true);
    await handleMassEdit(selectedIds, massEditStatus, massEditReason, attendanceRecords, () => {
      clearSelection();
      refreshAttendance();
    });
    setIsLoading(false);
  }, [handleMassEdit, selectedIds, attendanceRecords, clearSelection, refreshAttendance]);

  const handleSelectAllWrapper = useCallback((checked: boolean) => {
    handleSelectAll(checked, attendanceRecords);
  }, [handleSelectAll, attendanceRecords]);

  useEffect(() => {
    fetchSystemUsers();
  }, [fetchSystemUsers]);

  useEffect(() => {
    refreshAttendance();
  }, [refreshAttendance]);

  return {
    attendanceRecords,
    editingRecord,
    setEditingRecord,
    editReason,
    setEditReason,
    selectedDate,
    setSelectedDate,
    isLoading: isLoading || recordsLoading,
    fetchError,
    debugMessage,
    selectedIds,
    handleEditAttendance,
    handleMassEditSubmit,
    handleToggleSelect,
    handleSelectAll: handleSelectAllWrapper,
    fetchAttendanceRecords: refreshAttendance,
  };
}
