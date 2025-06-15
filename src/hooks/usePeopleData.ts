
import { useState, useEffect } from 'react';
import { useSystemUsers } from './useSystemUsers';
import { useAttendanceRecords } from './useAttendanceRecords';

export type Student = {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent';
  check_in_time?: string;
};

export type Staff = {
  id: string;
  name: string;
  department: string;
  status: 'present' | 'absent';
  check_in_time?: string;
};

export const usePeopleData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getUsersByRole, parseStudent, parseStaff } = useSystemUsers();
  const { getAttendanceMap } = useAttendanceRecords();

  const loadPeople = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsData, staffData] = await Promise.all([
        getUsersByRole("student"),
        getUsersByRole("staff"),
      ]);

      const attendanceMap = await getAttendanceMap();

      const parsedStudents = studentsData.map(user => {
        const student = parseStudent(user);
        return {
          ...student,
          status: attendanceMap[user.id] || 'absent',
          check_in_time: attendanceMap[user.id] === 'present' ? new Date().toLocaleTimeString() : undefined
        };
      });

      const parsedStaff = staffData.map(user => {
        const staffMember = parseStaff(user);
        return {
          ...staffMember,
          status: attendanceMap[user.id] || 'absent',
          check_in_time: attendanceMap[user.id] === 'present' ? new Date().toLocaleTimeString() : undefined
        };
      });

      setStudents(parsedStudents);
      setStaff(parsedStaff);
    } catch (err) {
      console.error('Error loading people data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeople();
  }, []);

  return {
    students,
    staff,
    loading,
    error,
    loadPeople,
  };
};
