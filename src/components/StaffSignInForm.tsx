import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useStaffAttendance } from '@/hooks/useStaffAttendance';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { StaffSignInHeader } from './staff-signin/StaffSignInHeader';
import { EmployeeCodeInput } from './staff-signin/EmployeeCodeInput';
import { StaffNotesInput } from './staff-signin/StaffNotesInput';
import { StaffSignInButtons } from './staff-signin/StaffSignInButtons';

interface StaffSignInFormProps {
  onSuccess?: () => void;
}

const StaffSignInForm = ({ onSuccess }: StaffSignInFormProps) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [notes, setNotes] = useState('');
  const {
    loading, setLoading,
    isValidCode, fetchStaffUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStaffAttendance();
  const { options: quickReasons, loading: optionsLoading } = useSignInOptions("staff", "sign_in");

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!isValidCode(employeeCode)) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await createAttendanceRecord(staff.id, "in", notes);

      toast({
        title: "Welcome!",
        description: `Employee ${employeeCode} signed in successfully`,
        variant: "default"
      });
      setEmployeeCode('');
      setNotes('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || "Unknown error.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (!isValidCode(employeeCode)) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const signedInToday = await hasTodaySignIn(staff.id);

      await createAttendanceRecord(staff.id, "out", notes);

      if (!signedInToday) {
        toast({
          title: "You forgot to sign in",
          description: "Make sure to sign in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Have a great day!",
          description: `Employee ${employeeCode} signed out successfully`,
          variant: "default"
        });
      }
      setEmployeeCode('');
      setNotes('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || "Unknown error.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <StaffSignInHeader />
      <CardContent className="space-y-4">
        <EmployeeCodeInput 
          value={employeeCode}
          onChange={setEmployeeCode}
          disabled={loading}
        />
        <StaffNotesInput
          value={notes}
          onChange={setNotes}
          disabled={loading}
          quickReasons={quickReasons}
        />
        <StaffSignInButtons
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default StaffSignInForm;
