import { useAttendanceQueries } from "./useAttendanceQueries";

export const useAttendanceData = () => {
  const attendanceQueries = useAttendanceQueries();

  // Since we removed the old attendance_records table and now have dedicated tables,
  // this hook is no longer needed in the same way. The new tabbed system uses
  // dedicated hooks for each table type instead.
  
  const fetchAttendanceRecords = async (filters?: any) => {
    // This function is deprecated in favor of the new dedicated table hooks
    console.warn('useAttendanceData.fetchAttendanceRecords is deprecated. Use dedicated table hooks instead.');
    return [];
  };

  const updateAttendanceRecord = async (id: string, updates: any) => {
    // This function is deprecated in favor of the new dedicated table hooks
    console.warn('useAttendanceData.updateAttendanceRecord is deprecated. Use dedicated table hooks instead.');
    return null;
  };

  const deleteAttendanceRecord = async (id: string) => {
    // This function is deprecated in favor of the new dedicated table hooks
    console.warn('useAttendanceData.deleteAttendanceRecord is deprecated. Use dedicated table hooks instead.');
  };

  return {
    fetchAttendanceRecords,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    ...attendanceQueries,
  };
};