import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptionsJson } from '@/hooks/useSignInOptionsJson';
import { useFormValidation } from '@/hooks/useFormValidation';
import { supabase } from '@/integrations/supabase/client';
import { VisitorFormFields } from './VisitorFormFields';
import { VisitorFormActions } from './VisitorFormActions';
import { SuccessBanner } from '@/components/ui/success-banner';

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
  
  const { toast } = useToast();
  const { options: visitTypes, loading: visitTypesLoading } = useSignInOptionsJson("both", "visit_type");

  const { validate, getFieldError, setFieldTouched, clearErrors } = useFormValidation({
    firstName: { required: true, minLength: 1 },
    lastName: { required: true, minLength: 1 },
    visitPurpose: { required: true },
  });

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
  };

  const handleRegisterVisitor = async () => {
    const isValid = validate({
      firstName: visitorData.firstName,
      lastName: visitorData.lastName,
      visitPurpose: visitorData.visitPurpose,
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

      setVisitorData({
        firstName: '',
        lastName: '',
        organization: '',
        visitPurpose: '',
        hostName: '',
        phoneNumber: '',
        notes: ''
      });
      
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
            }}
            onBlur={handleFieldBlur}
          />
          <VisitorFormActions
            onRegister={handleRegisterVisitor}
            loading={loading}
          />
        </CardContent>
      </Card>
    </>
  );
}
