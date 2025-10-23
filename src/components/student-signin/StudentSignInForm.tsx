
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudentAttendance } from '@/hooks/useStudentAttendance';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';
import { StudentCodeInput } from './StudentCodeInput';
import { NotesInput } from './NotesInput';
import { SignInButtons } from './SignInButtons';
import { SuccessBanner } from '@/components/ui/success-banner';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadPhoto } from '@/utils/photoUploadService';

interface StudentSignInFormProps {
  onSuccess?: () => void;
}

export function StudentSignInForm({ onSuccess }: StudentSignInFormProps) {
  const [studentCode, setStudentCode] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'in' | 'out' | null>(null);
  
  const {
    loading, setLoading,
    isValidCode, fetchStudentUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStudentAttendance();
  const { options: quickReasons } = useSignInOptions("student", "sign_in");
  const { settings } = useSystemSettings();
  const requirePhoto = settings.photo_capture_settings.requireStudentPhoto;

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
  };

  const handleCameraCapture = (photo: Blob) => {
    setCapturedPhoto(photo);
    setPhotoPreview(URL.createObjectURL(photo));
    setCameraOpen(false);
    
    if (pendingAction === 'in') {
      handleSignIn(photo);
    } else if (pendingAction === 'out') {
      handleSignOut(photo);
    }
  };

  const handleSignInClick = () => {
    if (requirePhoto) {
      setPendingAction('in');
      setCameraOpen(true);
    } else {
      handleSignIn();
    }
  };

  const handleSignOutClick = () => {
    if (requirePhoto) {
      setPendingAction('out');
      setCameraOpen(true);
    } else {
      handleSignOut();
    }
  };

  const handleSignIn = async (photoBlob?: Blob) => {
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

      let photoUrl = null;
      const photo = photoBlob || capturedPhoto;
      if (photo && requirePhoto) {
        photoUrl = await uploadPhoto(photo, 'students', student.user_code || studentCode, 'check_in');
      }

      const { error } = await supabase
        .from('student_attendance')
        .insert({
          student_id: student.user_code || studentCode,
          student_name: `${student.first_name} ${student.last_name}`,
          status: 'in',
          check_in_time: new Date().toISOString(),
          check_in_photo_url: photoUrl,
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
      setCapturedPhoto(null);
      setPhotoPreview(null);
      setPendingAction(null);
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

  const handleSignOut = async (photoBlob?: Blob) => {
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

      let photoUrl = null;
      const photo = photoBlob || capturedPhoto;
      if (photo && requirePhoto) {
        photoUrl = await uploadPhoto(photo, 'students', student.user_code || studentCode, 'check_out');
      }

      const signedInToday = await hasTodaySignIn(student.id);
      const { error } = await supabase
        .from('student_attendance')
        .insert({
          student_id: student.user_code || studentCode,
          student_name: `${student.first_name} ${student.last_name}`,
          status: 'out',
          check_out_time: new Date().toISOString(),
          check_out_photo_url: photoUrl,
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
      setCapturedPhoto(null);
      setPhotoPreview(null);
      setPendingAction(null);
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
        
        {photoPreview && (
          <div className="relative">
            <img src={photoPreview} alt="Captured" className="w-full h-32 object-cover rounded-lg" />
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => {
                setCapturedPhoto(null);
                setPhotoPreview(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}

        <SignInButtons
          onSignIn={handleSignInClick}
          onSignOut={handleSignOutClick}
          loading={loading}
        />
      </CardContent>

      <CameraCapture
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
        autoCapture={true}
        autoCaptureDelay={3000}
      />
    </>
  );
}
