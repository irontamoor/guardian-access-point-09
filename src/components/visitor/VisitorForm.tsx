import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptionsJson } from '@/hooks/useSignInOptionsJson';
import { useFormValidation } from '@/hooks/useFormValidation';
import { supabase } from '@/integrations/supabase/client';
import { VisitorFormFields } from './VisitorFormFields';
import { VisitorFormActions } from './VisitorFormActions';
import { SuccessBanner } from '@/components/ui/success-banner';
import { BadgePrintPreview } from './BadgePrintPreview';
import { BadgeTemplate } from './BadgeTemplate';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadPhoto } from '@/utils/photoUploadService';

export function VisitorForm() {
  const [visitorData, setVisitorData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    visitPurpose: '',
    hostName: '',
    phoneNumber: '',
    notes: ''
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

    setCameraOpen(true);
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
      let photoUrl = null;
      const photoToUpload = photoBlob || capturedPhoto;
      if (photoToUpload) {
        photoUrl = await uploadPhoto(photoToUpload, 'visitors', visitorData.firstName + visitorData.lastName, 'check_in');
      }

      const { error: attendanceError } = await supabase
        .from('visitor_records')
        .insert({
          first_name: visitorData.firstName,
          last_name: visitorData.lastName,
          organization: visitorData.organization || null,
          visit_purpose: visitorData.visitPurpose,
          host_name: visitorData.hostName || null,
          phone_number: visitorData.phoneNumber || null,
          notes: visitorData.notes || null,
          status: 'in',
          check_in_photo_url: photoUrl,
        });

      if (attendanceError) {
        console.error('Attendance record error:', attendanceError);
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
        notes: ''
      });
      
      setCapturedPhoto(null);
      setPhotoPreview(null);
      clearErrors();
    } catch (error: any) {
      console.error('Error registering visitor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register visitor",
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
