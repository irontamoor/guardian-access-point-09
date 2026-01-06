import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptionsJson } from '@/hooks/useSignInOptionsJson';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';
import { VisitorFormFields } from './VisitorFormFields';
import { VisitorFormActions } from './VisitorFormActions';
import { SuccessBanner } from '@/components/ui/success-banner';
import { BadgePrintPreview } from './BadgePrintPreview';
import { BadgeTemplate } from './BadgeTemplate';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadPhoto } from '@/utils/photoUploadService';
import { visitorSchema } from '@/utils/inputValidation';
import { sanitizeError } from '@/utils/errorHandler';

export function VisitorForm() {
  const [visitorData, setVisitorData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    visitPurpose: '',
    hostName: '',
    phoneNumber: '',
    notes: '',
    carRegistration: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [registeredVisitorData, setRegisteredVisitorData] = useState<any>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { options: visitTypes, loading: visitTypesLoading } = useSignInOptionsJson("both", "visit_type");
  const { settings } = useSystemSettings();

  const { validate, getFieldError, setFieldTouched, clearErrors } = useFormValidation({
    firstName: { required: true, minLength: 1 },
    lastName: { required: true, minLength: 1 },
    visitPurpose: { required: true },
    hostName: { required: true, minLength: 1 },
  });

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
  };

  const handleCameraCapture = (photo: Blob) => {
    setCapturedPhoto(photo);
    setPhotoPreview(URL.createObjectURL(photo));
    setCameraOpen(false);
    handleRegisterVisitor(photo);
  };

  const handleRegisterClick = () => {
    const isValid = validate({
      firstName: visitorData.firstName,
      lastName: visitorData.lastName,
      visitPurpose: visitorData.visitPurpose,
      hostName: visitorData.hostName,
    });

    if (!isValid) {
      toast({
        title: "Please fix the errors below",
        description: "Fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    // Check if photo is required
    if (settings.photo_capture_settings.requireVisitorPhoto) {
      setCameraOpen(true);
    } else {
      // Register without photo
      handleRegisterVisitor();
    }
  };

  const handleRegisterVisitor = async (photoBlob?: Blob) => {
    const isValid = validate({
      firstName: visitorData.firstName,
      lastName: visitorData.lastName,
      visitPurpose: visitorData.visitPurpose,
      hostName: visitorData.hostName,
    });

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
      // Server-side validation using Zod schema
      const validationResult = visitorSchema.safeParse({
        firstName: visitorData.firstName,
        lastName: visitorData.lastName,
        phoneNumber: visitorData.phoneNumber,
        organization: visitorData.organization,
        visitPurpose: visitorData.visitPurpose,
        hostName: visitorData.hostName,
        notes: visitorData.notes,
        carRegistration: visitorData.carRegistration,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError?.message || "Please check your input",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const validated = validationResult.data;

      let photoUrl = null;
      const photoToUpload = photoBlob || capturedPhoto;
      if (photoToUpload) {
        photoUrl = await uploadPhoto(photoToUpload, 'visitors', validated.firstName + validated.lastName, 'check_in');
      }

      const { error: attendanceError } = await supabase
        .from('visitor_records')
        .insert({
          first_name: validated.firstName,
          last_name: validated.lastName,
          organization: validated.organization || null,
          visit_purpose: validated.visitPurpose,
          host_name: validated.hostName || null,
          phone_number: validated.phoneNumber || null,
          notes: validated.notes || null,
          car_registration: validated.carRegistration || null,
          status: 'in',
          check_in_photo_url: photoUrl,
        });

      if (attendanceError) {
        throw attendanceError;
      }

      const successMsg = `${visitorData.firstName} ${visitorData.lastName} has been registered and checked in`;
      setSuccessMessage(successMsg);
      setShowSuccess(true);

      toast({
        title: "Visitor Registered Successfully!",
        description: successMsg,
        variant: "default"
      });

      // Store registered visitor data for printing
      setRegisteredVisitorData({
        first_name: visitorData.firstName,
        last_name: visitorData.lastName,
        organization: visitorData.organization,
        visit_purpose: visitorData.visitPurpose,
        host_name: visitorData.hostName,
        check_in_time: new Date().toISOString()
      });

      // Show print preview
      setShowPrintPreview(true);

      setVisitorData({
        firstName: '',
        lastName: '',
        organization: '',
        visitPurpose: '',
        hostName: '',
        phoneNumber: '',
        notes: '',
        carRegistration: ''
      });
      
      setCapturedPhoto(null);
      setPhotoPreview(null);
      clearErrors();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: sanitizeError(error),
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
        message="Visitor Registration Complete!"
        details={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-purple-600" />
            <span>Visitor Registration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VisitorFormFields
            visitorData={visitorData}
            onInputChange={handleInputChange}
            visitTypes={visitTypes}
            loading={loading}
            visitTypesLoading={visitTypesLoading}
            errors={{
              firstName: getFieldError('firstName'),
              lastName: getFieldError('lastName'),
              visitPurpose: getFieldError('visitPurpose'),
              hostName: getFieldError('hostName'),
            }}
            onBlur={handleFieldBlur}
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

          <VisitorFormActions
            onRegister={handleRegisterClick}
            loading={loading}
          />
        </CardContent>
      </Card>

      <CameraCapture
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
      />

      {/* Hidden badge template for printing */}
      {registeredVisitorData && (
        <div className="hidden print:block">
          <BadgeTemplate visitorData={registeredVisitorData} />
        </div>
      )}

      {/* Print Preview Modal */}
      {registeredVisitorData && (
        <BadgePrintPreview
          open={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          visitorData={registeredVisitorData}
        />
      )}
    </>
  );
}
