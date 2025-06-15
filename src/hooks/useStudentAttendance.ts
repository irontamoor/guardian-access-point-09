
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAttendanceLogic } from "./attendance/useAttendanceLogic";
import { useUserFetching } from "./users/useUserFetching";

// Extracted attendance logic for students
export const useStudentAttendance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { isValidCode, hasTodaySignIn, createAttendanceRecord } = useAttendanceLogic();
  const { fetchStudentUser } = useUserFetching();

  return {
    loading,
    setLoading,
    isValidCode,
    fetchStudentUser,
    hasTodaySignIn,
    createAttendanceRecord,
    toast,
  };
};
