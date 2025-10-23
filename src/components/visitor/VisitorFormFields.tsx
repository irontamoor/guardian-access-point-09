
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisitorFormFieldsProps {
  visitorData: any;
  onInputChange: (field: string, value: string) => void;
  visitTypes: any[];
  loading: boolean;
  visitTypesLoading: boolean;
  errors?: { [key: string]: { message: string; hasError: boolean } };
  onBlur?: (field: string) => void;
}

export function VisitorFormFields({ 
  visitorData, 
  onInputChange, 
  visitTypes, 
  loading, 
  visitTypesLoading,
  errors = {},
  onBlur
}: VisitorFormFieldsProps) {
  const getFieldError = (fieldName: string) => errors[fieldName] || { message: '', hasError: false };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className={cn(getFieldError('firstName').hasError && "text-destructive")}>
            First Name *
          </Label>
          <div className="relative">
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={visitorData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              onBlur={() => onBlur?.('firstName')}
              className={cn(getFieldError('firstName').hasError && "border-destructive focus-visible:ring-destructive")}
              disabled={loading}
            />
            {getFieldError('firstName').hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {getFieldError('firstName').hasError && (
            <p className="text-sm text-destructive">{getFieldError('firstName').message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className={cn(getFieldError('lastName').hasError && "text-destructive")}>
            Last Name *
          </Label>
          <div className="relative">
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={visitorData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              onBlur={() => onBlur?.('lastName')}
              className={cn(getFieldError('lastName').hasError && "border-destructive focus-visible:ring-destructive")}
              disabled={loading}
            />
            {getFieldError('lastName').hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {getFieldError('lastName').hasError && (
            <p className="text-sm text-destructive">{getFieldError('lastName').message}</p>
          )}
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
        <Label htmlFor="visitPurpose" className={cn(getFieldError('visitPurpose').hasError && "text-destructive")}>
          Purpose of Visit *
        </Label>
        <div className="relative">
          <Select
            value={visitorData.visitPurpose}
            onValueChange={(value) => onInputChange('visitPurpose', value)}
            disabled={loading || visitTypesLoading}
          >
            <SelectTrigger className={cn(getFieldError('visitPurpose').hasError && "border-destructive focus-visible:ring-destructive")}>
              <SelectValue placeholder={visitTypesLoading ? "Loading visit types..." : "Select purpose of visit"} />
            </SelectTrigger>
            <SelectContent>
              {visitTypes.map((type) => (
                <SelectItem key={type.id} value={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError('visitPurpose').hasError && (
            <AlertCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive z-10" />
          )}
        </div>
        {getFieldError('visitPurpose').hasError && (
          <p className="text-sm text-destructive">{getFieldError('visitPurpose').message}</p>
        )}
        {visitTypes.length === 0 && !visitTypesLoading && (
          <div className="text-xs text-gray-500">No visit types configured</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hostName" className={cn(getFieldError('hostName').hasError && "text-destructive")}>
          Host/Contact Person *
        </Label>
        <div className="relative">
          <Input
            id="hostName"
            placeholder="Who are you visiting?"
            value={visitorData.hostName}
            onChange={(e) => onInputChange('hostName', e.target.value)}
            onBlur={() => onBlur?.('hostName')}
            className={cn(getFieldError('hostName').hasError && "border-destructive focus-visible:ring-destructive")}
            disabled={loading}
          />
          {getFieldError('hostName').hasError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        {getFieldError('hostName').hasError && (
          <p className="text-sm text-destructive">{getFieldError('hostName').message}</p>
        )}
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
        <Label htmlFor="carRegistration">Vehicle Registration (Optional)</Label>
        <Input
          id="carRegistration"
          placeholder="Enter license plate number"
          value={visitorData.carRegistration}
          onChange={(e) => onInputChange('carRegistration', e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Enter vehicle/car registration if parking on premises
        </p>
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
