import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { query } from '@/integrations/postgres/client';

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
      // Insert visitor data
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

      // Create attendance record for the visitor
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

      // Reset form
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={visitorData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={visitorData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization/Company</Label>
          <Input
            id="organization"
            placeholder="Enter organization name"
            value={visitorData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitPurpose">Purpose of Visit *</Label>
          <Select
            value={visitorData.visitPurpose}
            onValueChange={(value) => handleInputChange('visitPurpose', value)}
            disabled={loading || visitTypesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select purpose of visit" />
            </SelectTrigger>
            <SelectContent>
              {visitTypes.map((type) => (
                <SelectItem key={type.id} value={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hostName">Host/Contact Person</Label>
          <Input
            id="hostName"
            placeholder="Who are you visiting?"
            value={visitorData.hostName}
            onChange={(e) => handleInputChange('hostName', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter phone number"
            value={visitorData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information"
            value={visitorData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleRegisterVisitor}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            <Badge className="h-4 w-4 mr-2" />
            {loading ? 'Registering...' : 'Register & Print Badge'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
