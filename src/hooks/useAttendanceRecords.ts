
import { useAttendanceMapping } from "./attendance/useAttendanceMapping";

// Re-export types for convenience
export type { AttendanceStatusMap } from "./attendance/useAttendanceMapping";

export function useAttendanceRecords() {
  const { getAttendanceMap } = useAttendanceMapping();

  return { getAttendanceMap };
}
