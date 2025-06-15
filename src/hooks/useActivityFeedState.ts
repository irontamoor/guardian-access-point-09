
import { useState, useEffect } from 'react';
import type { Student, Staff } from './usePeopleData';

export type ActivityRecord = {
  id: string;
  name: string;
  action: string;
  time: string;
  type: 'student' | 'staff';
};

export const useActivityFeedState = (students: Student[], staff: Staff[]) => {
  const [recentActivity, setRecentActivity] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    // Generate mock recent activity based on present students and staff
    const presentPeople = [
      ...students.filter(s => s.status === 'present').map(s => ({ ...s, type: 'student' as const })),
      ...staff.filter(s => s.status === 'present').map(s => ({ ...s, type: 'staff' as const }))
    ];

    const activity = presentPeople.slice(0, 10).map((person, index) => ({
      id: `${person.id}-${index}`,
      name: person.name,
      action: 'signed in',
      time: new Date(Date.now() - index * 300000).toLocaleTimeString(), // 5 min intervals
      type: person.type
    }));

    setRecentActivity(activity);
  }, [students, staff]);

  return { recentActivity };
};
