
import { useState, useEffect } from 'react';
import { useUserManagement } from './users/useUserManagement';
import { useAttendanceData } from './attendance/useAttendanceData';

export const useAdminData = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalStaff: 0,
    presentToday: 0,
    totalAttendanceRecords: 0,
  });
  const [loading, setLoading] = useState(false);

  const { fetchUsersByRole } = useUserManagement();
  const { fetchAttendanceRecords } = useAttendanceData();

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const [students, staff, attendanceRecords] = await Promise.all([
        fetchUsersByRole("student"),
        fetchUsersByRole("staff"),
        fetchAttendanceRecords(),
      ]);

      // Calculate present today (simplified - in reality you'd check for active sign-ins)
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = attendanceRecords.filter(record => 
        record.created_at?.startsWith(today) && record.status === 'in'
      );

      setMetrics({
        totalStudents: students.length,
        totalStaff: staff.length,
        presentToday: todayRecords.length,
        totalAttendanceRecords: attendanceRecords.length,
      });
    } catch (error) {
      console.error('Error loading admin metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return {
    metrics,
    loading,
    reload: loadMetrics,
  };
};
