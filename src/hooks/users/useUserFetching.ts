
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserFetching() {
  const fetchStudentUser = useCallback(async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, student_id, first_name, last_name, grade, status')
        .eq('student_id', studentId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Student lookup error:', error);
        return null;
      }
      
      if (!data) {
        console.log('Student not found in database:', studentId);
        return null;
      }
      
      // Return in a format compatible with existing code
      return {
        id: data.id,
        user_code: data.student_id,
        first_name: data.first_name,
        last_name: data.last_name,
        status: data.status
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  }, []);

  const fetchStaffUser = useCallback(async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, employee_id, first_name, last_name, department, position, status')
        .eq('employee_id', employeeId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Staff lookup error:', error);
        return null;
      }
      
      if (!data) {
        console.log('Staff not found in database:', employeeId);
        return null;
      }
      
      // Return in a format compatible with existing code
      return {
        id: data.id,
        user_code: data.employee_id,
        first_name: data.first_name,
        last_name: data.last_name,
        status: data.status
      };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return null;
    }
  }, []);

  return {
    fetchStudentUser,
    fetchStaffUser,
  };
}
