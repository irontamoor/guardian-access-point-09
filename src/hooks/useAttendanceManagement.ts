
import { useState, useEffect, useCallback } from 'react';
import { useAttendanceRecordsState } from './attendance/useAttendanceRecordsState';
import { useAttendanceEdit } from './attendance/useAttendanceEdit';
import { useMassEdit } from './attendance/useMassEdit';

export function useAttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState('all');
  
  const {
    attendanceRecords,
    isLoading,
    setIsLoading,
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
    handleEditAttendance: handleEdit,
  } = useAttendanceEdit();

  const {
    selectedIds,
    handleMassEditSubmit: handleMassEdit,
    handleToggleSelect,
    handleSelectAll: handleSelectAllBase,
  } = useMassEdit();

  const refreshAttendance = useCallback(() => {
    fetchAttendanceRecords(selectedDate);
  }, [fetchAttendanceRecords, selectedDate]);

  const handleEditAttendance = useCallback(async () => {
    setIsLoading(true);
    await handleEdit(attendanceRecords, refreshAttendance);
    setIsLoading(false);
  }, [handleEdit, attendanceRecords, refreshAttendance, setIsLoading]);

  const handleMassEditSubmit = useCallback(async (massEditStatus: "in" | "out", massEditReason: string) => {
    setIsLoading(true);
    await handleMassEdit(massEditStatus, massEditReason, attendanceRecords, refreshAttendance);
    setIsLoading(false);
  }, [handleMassEdit, attendanceRecords, refreshAttendance, setIsLoading]);

  const handleSelectAll = useCallback((checked: boolean) => {
    handleSelectAllBase(checked, attendanceRecords);
  }, [handleSelectAllBase, attendanceRecords]);

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
    isLoading,
    fetchError,
    debugMessage,
    selectedIds,
    handleEditAttendance,
    handleMassEditSubmit,
    handleToggleSelect,
    handleSelectAll,
    fetchAttendanceRecords: refreshAttendance,
  };
}
