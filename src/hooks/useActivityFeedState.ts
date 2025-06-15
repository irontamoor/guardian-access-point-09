
import { useEffect, useState } from "react";
import type { Student, Staff } from "./usePeopleData";
import { buildActivityFeed } from "./useActivityFeed";

export interface ActivityRecord {
  id: string;
  type: 'student' | 'staff';
  name: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

export function useActivityFeedState(students: Student[], staff: Staff[]) {
  const [recentActivity, setRecentActivity] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    setRecentActivity(buildActivityFeed(students, staff));
  }, [students, staff]);

  return { recentActivity };
}
