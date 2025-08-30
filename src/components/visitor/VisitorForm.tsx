import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptionsJson } from '@/hooks/useSignInOptionsJson';
import { supabase } from '@/integrations/supabase/client';
import { VisitorFormFields } from './VisitorFormFields';
import { VisitorFormActions } from './VisitorFormActions';

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
  const { toast } = useToast();
  const { options: visitTypes, loading: visitTypesLoading } = useSignInOptionsJson("both", "visit_type");

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterVisitor = async () => {
    // Enhanced validation
    const missingFields = [];
    if (!visitorData.firstName.trim()) missingFields.push('First Name');
    if (!visitorData.lastName.trim()) missingFields.push('Last Name');
    if (!visitorData.visitPurpose.trim()) missingFields.push('Visit Purpose');

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(', ')}`,
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

      toast({
        title: "Visitor Registered Successfully!",
        description: `${visitorData.firstName} ${visitorData.lastName} has been registered and checked in.`,
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
        />
        <VisitorFormActions
          onRegister={handleRegisterVisitor}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
