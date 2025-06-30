
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptions } from '@/hooks/useSignInOptions';
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
  const { options: visitTypes, loading: visitTypesLoading } = useSignInOptions("both", "visit_type");

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterVisitor = async () => {
    if (!visitorData.firstName || !visitorData.lastName || !visitorData.visitPurpose) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First, create the visitor record
      const { data: visitor, error: visitorError } = await supabase
        .from('visitors')
        .insert({
          first_name: visitorData.firstName,
          last_name: visitorData.lastName,
          organization: visitorData.organization,
          visit_purpose: visitorData.visitPurpose,
          host_name: visitorData.hostName,
          phone_number: visitorData.phoneNumber,
          notes: visitorData.notes
        })
        .select()
        .single();

      if (visitorError) throw visitorError;

      // Then create the attendance record using the visitor's ID
      // Note: We use the visitor's ID directly as user_id since the attendance system 
      // is designed to track both system users and visitors
      const { error: attendanceError } = await supabase
        .from('attendance_records')
        .insert({
          user_id: visitor.id,
          status: 'in',
          check_in_time: new Date().toISOString(),
          company: visitorData.organization,
          purpose: visitorData.visitPurpose,
          host_name: visitorData.hostName,
          notes: visitorData.notes
        });

      if (attendanceError) {
        console.error('Attendance record error:', attendanceError);
        // If attendance record fails, we still want to show success for visitor registration
        // but log the error for debugging
        toast({
          title: "Visitor Registered!",
          description: `${visitorData.firstName} ${visitorData.lastName} has been registered. Note: Check-in record may need manual entry.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Visitor Registered!",
          description: `${visitorData.firstName} ${visitorData.lastName} has been registered and checked in. Badge will be printed.`,
          variant: "default"
        });
      }

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
