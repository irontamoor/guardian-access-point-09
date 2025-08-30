
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';
import { supabase } from '@/integrations/supabase/client';
import { PickupInfoFieldsEnhanced } from './PickupInfoFieldsEnhanced';
import { RelationshipSelectEnhanced } from './RelationshipSelectEnhanced';
import { PickupTypeSelect } from './PickupTypeSelect';
import { PickupNotesInput } from './PickupNotesInput';
import { ApprovalToggle } from './ApprovalToggle';
import { SuccessBanner } from '@/components/ui/success-banner';

interface PickupFormProps {
  onBack: () => void;
}

export function PickupForm({ onBack }: PickupFormProps) {
  const [pickupData, setPickupData] = useState({
    studentId: '',
    studentName: '',
    parentGuardianName: '',
    relationship: '',
    pickupType: '',
    notes: '',
    approved: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { toast } = useToast();

  const { validate, getFieldError, setFieldTouched, clearErrors } = useFormValidation({
    studentId: { required: true, minLength: 2 },
    parentGuardianName: { required: true, minLength: 1 },
    relationship: { required: true },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setPickupData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched(field);
  };

  const savePickupRecord = async (action: 'pickup' | 'dropoff') => {
    const isValid = validate({
      studentId: pickupData.studentId,
      parentGuardianName: pickupData.parentGuardianName,
      relationship: pickupData.relationship,
    });

    if (!isValid) {
      toast({
        title: "Please fix the errors below",
        description: "Fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('parent_pickup_records')
        .insert({
          student_id: pickupData.studentId,
          student_name: pickupData.studentName,
          parent_guardian_name: pickupData.parentGuardianName,
          relationship: pickupData.relationship,
          pickup_type: pickupData.pickupType,
          action_type: action,
          notes: pickupData.notes || null,
          approved: pickupData.approved
        });

      if (error) {
        console.error('Error saving pickup record:', error);
        throw error;
      }

      const actionText = action === 'pickup' ? 'picked up' : 'dropped off';
      const successMsg = `${pickupData.parentGuardianName} has ${actionText} ${pickupData.studentId}${pickupData.studentName ? ` (${pickupData.studentName})` : ''}`;
      
      setSuccessMessage(successMsg);
      setShowSuccess(true);

      toast({
        title: `${action === 'pickup' ? 'Pickup' : 'Drop-off'} Recorded Successfully!`,
        description: successMsg,
        variant: "default"
      });

      // Reset form
      setPickupData({
        studentId: '',
        studentName: '',
        parentGuardianName: '',
        relationship: '',
        pickupType: '',
        notes: '',
        approved: false
      });
      
      clearErrors();

    } catch (error: any) {
      console.error(`Error recording ${action}:`, error);
      toast({
        title: "Error Recording Action",
        description: `Failed to record ${action}. ${error.message || 'Please try again or contact support.'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickup = () => savePickupRecord('pickup');
  const handleDropoff = () => savePickupRecord('dropoff');

  return (
    <>
      <SuccessBanner
        show={showSuccess}
        message="Pickup/Drop-off Complete!"
        details={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
      <CardContent className="space-y-4">
        <PickupInfoFieldsEnhanced
          studentId={pickupData.studentId}
          onStudentIdChange={(value) => handleInputChange('studentId', value)}
          studentName={pickupData.studentName}
          onStudentNameChange={(value) => handleInputChange('studentName', value)}
          parentGuardianName={pickupData.parentGuardianName}  
          onParentGuardianNameChange={(value) => handleInputChange('parentGuardianName', value)}
          loading={isLoading}
          errors={{
            studentId: getFieldError('studentId'),
            parentGuardianName: getFieldError('parentGuardianName'),
          }}
          onBlur={handleFieldBlur}
        />
        
        <RelationshipSelectEnhanced
          value={pickupData.relationship}
          onChange={(value) => handleInputChange('relationship', value)}
          loading={isLoading}
          error={getFieldError('relationship').hasError ? getFieldError('relationship').message : undefined}
          onBlur={() => handleFieldBlur('relationship')}
        />
        
        <PickupTypeSelect
          value={pickupData.pickupType}
          onChange={(value) => handleInputChange('pickupType', value)}
        />

        <PickupNotesInput
          value={pickupData.notes}
          onChange={(value) => handleInputChange('notes', value)}
        />

        <ApprovalToggle
          approved={pickupData.approved}
          onApprovalChange={(approved) => handleInputChange('approved', approved)}
          disabled={isLoading}
        />

        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handlePickup}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isLoading ? 'Recording...' : 'Record Pickup'}
          </Button>
          <Button 
            onClick={handleDropoff}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <UserX className="h-4 w-4 mr-2" />
            {isLoading ? 'Recording...' : 'Record Drop-off'}
          </Button>
        </div>
      </CardContent>
    </>
  );
}
