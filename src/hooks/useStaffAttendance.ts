
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAttendanceLogic } from "./attendance/useAttendanceLogic";
import { useUserFetching } from "./users/useUserFetching";

export const useStaffAttendance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { isValidCode, hasTodaySignIn, createAttendanceRecord } = useAttendanceLogic();
  const { fetchStaffUser } = useUserFetching();

  return {
    loading,
    setLoading,
    isValidCode,
    fetchStaffUser,
    hasTodaySignIn,
    createAttendanceRecord,
    toast,
  };
};
