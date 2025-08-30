
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { useStudentAttendance } from '@/hooks/useStudentAttendance';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { supabase } from '@/integrations/supabase/client';
import { StudentCodeInput } from './StudentCodeInput';
import { NotesInput } from './NotesInput';
import { SignInButtons } from './SignInButtons';
import { SuccessBanner } from '@/components/ui/success-banner';

interface StudentSignInFormProps {
  onSuccess?: () => void;
}

export function StudentSignInForm({ onSuccess }: StudentSignInFormProps) {
  const [studentCode, setStudentCode] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    loading, setLoading,
    isValidCode, fetchStudentUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStudentAttendance();
  const { options: quickReasons } = useSignInOptions("student", "sign_in");

  const { validate, getFieldError, setFieldTouched, clearErrors } = useFormValidation({
    studentCode: { 
      required: true, 
      minLength: 2,
      custom: (value) => {
        if (value && !isValidCode(value)) {
          return 'Please enter a valid student ID format';
        }
        return null;
      }
    },
  });

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
    if (field === 'studentCode') {
      const isValid = validate({ studentCode });
      // Don't show validation errors during blur, just mark as touched
    }
  };

  const handleSignIn = async () => {
    const isValid = validate({ studentCode });
    if (!isValid) {
      toast({
        title: "Please fix the errors below",
        description: "Fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const student = await fetchStudentUser(studentCode);
      if (!student) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('student_attendance')
        .insert({
          student_id: student.user_code || studentCode,
          student_name: `${student.first_name} ${student.last_name}`,
          status: 'in',
          check_in_time: new Date().toISOString(),
          notes: notes || null,
        });

      if (error) throw error;

      const successMsg = `${student.first_name} ${student.last_name} signed in successfully`;
      setSuccessMessage(successMsg);
      setShowSuccess(true);
      
      toast({
        title: "Success!",
        description: successMsg,
        variant: "default"
      });
      
      setStudentCode('');
      setNotes('');
      clearErrors();
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
    const isValid = validate({ studentCode });
    if (!isValid) {
      toast({
        title: "Please fix the errors below",
        description: "Fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
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
      const { error } = await supabase
        .from('student_attendance')
        .insert({
          student_id: student.user_code || studentCode,
          student_name: `${student.first_name} ${student.last_name}`,
          status: 'out',
          check_out_time: new Date().toISOString(),
          notes: notes || null,
        });

      if (error) throw error;

      const successMsg = signedInToday 
        ? `${student.first_name} ${student.last_name} signed out successfully`
        : `${student.first_name} ${student.last_name} signed out (note: no sign-in record found for today)`;
      
      setSuccessMessage(successMsg);
      setShowSuccess(true);

      if (!signedInToday) {
        toast({
          title: "You forgot to sign in",
          description: "Make sure to sign in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: successMsg,
          variant: "default"
        });
      }
      
      setStudentCode('');
      setNotes('');
      clearErrors();
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
    <>
      <SuccessBanner
        show={showSuccess}
        message="Student Sign-In Complete!"
        details={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
      <CardContent className="space-y-4">
        <StudentCodeInput 
          value={studentCode}
          onChange={setStudentCode}
          disabled={loading}
          error={getFieldError('studentCode').hasError ? getFieldError('studentCode').message : undefined}
          onBlur={() => handleFieldBlur('studentCode')}
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
    </>
  );
}
