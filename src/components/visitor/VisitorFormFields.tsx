
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface VisitorFormFieldsProps {
  visitorData: any;
  onInputChange: (field: string, value: string) => void;
  visitTypes: any[];
  loading: boolean;
  visitTypesLoading: boolean;
}

export function VisitorFormFields({ 
  visitorData, 
  onInputChange, 
  visitTypes, 
  loading, 
  visitTypesLoading 
}: VisitorFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="Enter first name"
            value={visitorData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Enter last name"
            value={visitorData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
          onChange={(e) => onInputChange('organization', e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="visitPurpose">Purpose of Visit *</Label>
        <Select
          value={visitorData.visitPurpose}
          onValueChange={(value) => onInputChange('visitPurpose', value)}
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
          onChange={(e) => onInputChange('hostName', e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          placeholder="Enter phone number"
          value={visitorData.phoneNumber}
          onChange={(e) => onInputChange('phoneNumber', e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional information"
          value={visitorData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          className="resize-none"
          disabled={loading}
        />
      </div>
    </>
  );
}
