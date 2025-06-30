
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { query } from '@/integrations/postgres/client';
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
      const visitorResult = await query(
        `INSERT INTO visitors (first_name, last_name, organization, visit_purpose, host_name, phone_number, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          visitorData.firstName,
          visitorData.lastName,
          visitorData.organization,
          visitorData.visitPurpose,
          visitorData.hostName,
          visitorData.phoneNumber,
          visitorData.notes
        ]
      );

      if (visitorResult.rows.length === 0) throw new Error('Failed to create visitor');
      const visitor = visitorResult.rows[0];

      await query(
        `INSERT INTO attendance_records (user_id, status, check_in_time, company, purpose, host_name, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          visitor.id,
          'in',
          new Date().toISOString(),
          visitorData.organization,
          visitorData.visitPurpose,
          visitorData.hostName,
          visitorData.notes
        ]
      );

      toast({
        title: "Visitor Registered!",
        description: `${visitorData.firstName} ${visitorData.lastName} has been registered and checked in. Badge will be printed.`,
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
