
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useStaffAttendance } from '@/hooks/useStaffAttendance';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeCodeInput } from './EmployeeCodeInput';
import { StaffNotesInput } from './StaffNotesInput';
import { StaffSignInButtons } from './StaffSignInButtons';
import { SuccessBanner } from '@/components/ui/success-banner';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadPhoto } from '@/utils/photoUploadService';

interface StaffSignInFormProps {
  onSuccess?: () => void;
}

export function StaffSignInForm({ onSuccess }: StaffSignInFormProps) {
  const [employeeCode, setEmployeeCode] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'in' | 'out' | null>(null);
  
  const {
    loading, setLoading,
    isValidCode, fetchStaffUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStaffAttendance();
  const { options: quickReasons } = useSignInOptions("staff", "sign_in");

  const { validate, getFieldError, setFieldTouched, clearErrors } = useFormValidation({
    employeeCode: { 
      required: true, 
      minLength: 2,
      custom: (value) => {
        if (value && !isValidCode(value)) {
          return 'Please enter a valid employee ID format';
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
    setPendingAction('in');
    setCameraOpen(true);
  };

  const handleSignOutClick = () => {
    setPendingAction('out');
    setCameraOpen(true);
  };

  const handleSignIn = async (photoBlob?: Blob) => {
    const isValid = validate({ employeeCode });
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
      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        return;
      }

      let photoUrl = null;
      const photo = photoBlob || capturedPhoto;
      if (photo) {
        photoUrl = await uploadPhoto(photo, 'staff', staff.user_code || employeeCode, 'check_in');
      }

      const { error } = await supabase
        .from('staff_attendance')
        .insert({
          employee_id: staff.user_code || employeeCode,
          employee_name: `${staff.first_name} ${staff.last_name}`,
          status: 'in',
          check_in_time: new Date().toISOString(),
          check_in_photo_url: photoUrl,
          notes: notes || null,
        });

      if (error) throw error;

      const successMsg = `${staff.first_name} ${staff.last_name} signed in successfully`;
      setSuccessMessage(successMsg);
      setShowSuccess(true);

      toast({
        title: "Success!",
        description: successMsg,
        variant: "default"
      });
      
      setEmployeeCode('');
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
    const isValid = validate({ employeeCode });
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
      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        return;
      }

      let photoUrl = null;
      const photo = photoBlob || capturedPhoto;
      if (photo) {
        photoUrl = await uploadPhoto(photo, 'staff', staff.user_code || employeeCode, 'check_out');
      }

      const signedInToday = await hasTodaySignIn(staff.id);
      const { error } = await supabase
        .from('staff_attendance')
        .insert({
          employee_id: staff.user_code || employeeCode,
          employee_name: `${staff.first_name} ${staff.last_name}`,
          status: 'out',
          check_out_time: new Date().toISOString(),
          check_out_photo_url: photoUrl,
          notes: notes || null,
        });

      if (error) throw error;

      const successMsg = signedInToday 
        ? `${staff.first_name} ${staff.last_name} signed out successfully`
        : `${staff.first_name} ${staff.last_name} signed out (note: no sign-in record found for today)`;
      
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
          title: "Have a great day!",
          description: successMsg,
          variant: "default"
        });
      }
      
      setEmployeeCode('');
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
        message="Staff Sign-In Complete!"
        details={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
      <CardContent className="space-y-4">
        <EmployeeCodeInput 
          value={employeeCode}
          onChange={setEmployeeCode}
          disabled={loading}
          error={getFieldError('employeeCode').hasError ? getFieldError('employeeCode').message : undefined}
          onBlur={() => handleFieldBlur('employeeCode')}
        />
        <StaffNotesInput
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

        <StaffSignInButtons
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
