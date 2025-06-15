
import { useCallback, useState } from "react";
import { useSystemUsersData } from "./users/useSystemUsersData";
import { parseStudent, parseStaff } from "./users/useUserParsers";
import { useAttendanceMapping } from "./attendance/useAttendanceMapping";

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export function usePeopleData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getUsersByRole } = useSystemUsersData();
  const { getAttendanceMap } = useAttendanceMapping();

  const loadPeople = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentRows, staffRows, attendanceMap] = await Promise.all([
        getUsersByRole("student"),
        getUsersByRole("staff"),
        getAttendanceMap()
      ]);

      setStudents(studentRows.map(u => {
        const att = attendanceMap[u.id];
        return {
          ...parseStudent(u),
          status: att?.status === "present" ? "present" : "absent",
          check_in_time: att?.check_in_time,
          check_out_time: att?.check_out_time,
        };
      }));

      setStaff(staffRows.map(u => {
        const att = attendanceMap[u.id];
        return {
          ...parseStaff(u),
          status: att?.status === "present" ? "present" : "absent",
          check_in_time: att?.check_in_time,
          check_out_time: att?.check_out_time,
        };
      }));

    } catch (e: any) {
      setStudents([]);
      setStaff([]);
      setError("Failed to load people: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [getUsersByRole, getAttendanceMap]);

  return { students, staff, loading, error, loadPeople };
}
