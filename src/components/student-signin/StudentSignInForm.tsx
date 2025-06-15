
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { useStudentAttendance } from '@/hooks/useStudentAttendance';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { StudentCodeInput } from './StudentCodeInput';
import { NotesInput } from './NotesInput';
import { SignInButtons } from './SignInButtons';

interface StudentSignInFormProps {
  onSuccess?: () => void;
}

export function StudentSignInForm({ onSuccess }: StudentSignInFormProps) {
  const [studentCode, setStudentCode] = useState('');
  const [notes, setNotes] = useState('');
  const {
    loading, setLoading,
    isValidCode, fetchStudentUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStudentAttendance();
  const { options: quickReasons } = useSignInOptions("student", "sign_in");

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!isValidCode(studentCode)) {
        toast({
          title: "Error",
          description: "Please enter a student ID",
          variant: "destructive"
        });
        return;
      }

      const student = await fetchStudentUser(studentCode);
      if (!student) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        return;
      }

      await createAttendanceRecord(student.id, "in", notes);

      toast({
        title: "Success!",
        description: `Student ${studentCode} signed in successfully`,
        variant: "default"
      });
      setStudentCode('');
      setNotes('');
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Unknown error.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (!isValidCode(studentCode)) {
        toast({
          title: "Error",
          description: "Please enter a student ID",
          variant: "destructive"
        });
        return;
      }

      const student = await fetchStudentUser(studentCode);
      if (!student) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        return;
      }

      const signedInToday = await hasTodaySignIn(student.id);
      await createAttendanceRecord(student.id, "out", notes);

      if (!signedInToday) {
        toast({
          title: "You forgot to sign in",
          description: "Make sure to sign in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: `Student ${studentCode} signed out successfully`,
          variant: "default"
        });
      }
      setStudentCode('');
      setNotes('');
      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Unknown error.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4">
      <StudentCodeInput 
        value={studentCode}
        onChange={setStudentCode}
        disabled={loading}
      />
      <NotesInput
        value={notes}
        onChange={setNotes}
        disabled={loading}
        quickReasons={quickReasons}
      />
      <SignInButtons
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        loading={loading}
      />
    </CardContent>
  );
}
