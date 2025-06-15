
// Re-export types from the modular structure
export type { Student, Staff } from "./usePeopleData";
export type { ActivityRecord } from "./useActivityFeedState";

import { usePeopleData } from "./usePeopleData";
import { useActivityFeedState } from "./useActivityFeedState";
import { useVMSOperations } from "./data/useVMSOperations";

export const useVMSData = () => {
  const {
    students,
    staff,
    loading,
    error,
    loadPeople,
  } = usePeopleData();

  const { recentActivity } = useActivityFeedState(students, staff);
  const vmsOperations = useVMSOperations(loadPeople);

  return {
    students,
    staff,
    recentActivity,
    loading,
    error,
    ...vmsOperations,
    reload: loadPeople
  };
};
