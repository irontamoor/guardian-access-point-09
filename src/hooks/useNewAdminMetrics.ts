import { useState, useEffect } from 'react';
import { useUserManagement } from './users/useUserManagement';
import { supabase } from '@/integrations/supabase/client';

export const useNewAdminMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    totalStaff: 0,
    presentToday: 0,
    totalAttendanceRecords: 0,
  });
  const [loading, setLoading] = useState(false);

  const { fetchUsersByRole } = useUserManagement();

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [students, staff, studentAttendance, staffAttendance, visitorRecords, parentPickup] = await Promise.all([
        fetchUsersByRole("student"),
        fetchUsersByRole("staff"),
        supabase
          .from('student_attendance')
          .select('*')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`),
        supabase
          .from('staff_attendance')
          .select('*')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`),
        supabase
          .from('visitor_records')
          .select('*'),
        supabase
          .from('parent_pickup_records')
          .select('*')
      ]);

      // Calculate present today from latest records
      const studentPresent = new Set();
      const staffPresent = new Set();
      
      // Get latest status for each student
      const studentsByUser: Record<string, any> = {};
      (studentAttendance.data || []).forEach((record: any) => {
        if (!studentsByUser[record.student_id] || new Date(record.created_at) > new Date(studentsByUser[record.student_id].created_at)) {
          studentsByUser[record.student_id] = record;
        }
      });
      
      Object.values(studentsByUser).forEach((record: any) => {
        if (record.status === 'in') {
          studentPresent.add(record.student_id);
        }
      });

      // Get latest status for each staff member
      const staffByUser: Record<string, any> = {};
      (staffAttendance.data || []).forEach((record: any) => {
        if (!staffByUser[record.employee_id] || new Date(record.created_at) > new Date(staffByUser[record.employee_id].created_at)) {
          staffByUser[record.employee_id] = record;
        }
      });
      
      Object.values(staffByUser).forEach((record: any) => {
        if (record.status === 'in') {
          staffPresent.add(record.employee_id);
        }
      });

      // Calculate total records
      const totalRecords = 
        (studentAttendance.data?.length || 0) +
        (staffAttendance.data?.length || 0) +
        (visitorRecords.data?.length || 0) +
        (parentPickup.data?.length || 0);

      setMetrics({
        totalStudents: students.length,
        totalStaff: staff.length,
        presentToday: studentPresent.size + staffPresent.size,
        totalAttendanceRecords: totalRecords,
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