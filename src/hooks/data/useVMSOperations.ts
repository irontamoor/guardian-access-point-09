
import { useDataOperations } from "./useDataOperations";
import { useAttendanceOperations } from "./useAttendanceOperations";

export const useVMSOperations = (loadPeople: () => void) => {
  const { addStudent, addStaff } = useDataOperations();
  const { updateStudentStatus, updateStaffStatus } = useAttendanceOperations();

  // Enhanced operations that include data reload
  const addStudentWithReload = async (studentData: { id: string; name: string; grade: string }) => {
    await addStudent(studentData);
    loadPeople();
  };

  const addStaffWithReload = async (staffData: { id: string; name: string; department: string }) => {
    await addStaff(staffData);
    loadPeople();
  };

  const updateStudentStatusWithReload = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await updateStudentStatus(userId, status, time);
    loadPeople();
  };

  const updateStaffStatusWithReload = async (userId: string, status: 'present' | 'absent', time?: string) => {
    await updateStaffStatus(userId, status, time);
    loadPeople();
  };

  return {
    addStudent: addStudentWithReload,
    addStaff: addStaffWithReload,
    updateStudentStatus: updateStudentStatusWithReload,
    updateStaffStatus: updateStaffStatusWithReload,
  };
};
