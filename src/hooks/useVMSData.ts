
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useVMSData() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateStudentStatus = async (userId: string, status: "present" | "absent") => {
    setIsLoading(true);
    try {
      // Create attendance record for today
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`
        });

      if (error) throw error;

      console.log(`Student ${userId} attendance updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating student status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffStatus = async (userId: string, status: "present" | "absent") => {
    setIsLoading(true);
    try {
      // Create attendance record for today
      const now = new Date();
      const attendanceStatus = status === "present" ? "in" : "out";
      
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          status: attendanceStatus,
          check_in_time: status === "present" ? now.toISOString() : null,
          check_out_time: status === "absent" ? now.toISOString() : null,
          notes: `Status updated to ${status} via admin panel`
        });

      if (error) throw error;

      console.log(`Staff ${userId} attendance updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating staff status:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStudentStatus,
    updateStaffStatus,
    isLoading
  };
}
