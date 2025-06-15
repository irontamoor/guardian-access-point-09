
import type { Student, Staff } from "./usePeopleData";
import type { ActivityRecord } from "./useActivityFeedState";

export function buildActivityFeed(
  students: Student[],
  staff: Staff[]
): ActivityRecord[] {
  const activity: ActivityRecord[] = [
    ...students.filter(s => s.status === "present").map(s => ({
      id: s.id + '_activity',
      type: 'student' as const,
      name: s.name,
      action: 'Signed In',
      time: s.check_in_time || new Date().toLocaleTimeString(),
      status: 'success' as const
    })),
    ...staff.filter(s => s.status === "present").map(s => ({
      id: s.id + '_activity',
      type: 'staff' as const,
      name: s.name,
      action: 'Signed In',
      time: s.check_in_time || new Date().toLocaleTimeString(),
      status: 'success' as const
    })),
  ];
  return activity.slice(0, 10);
}
