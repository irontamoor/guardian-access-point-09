
import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PickupInfoFields } from './PickupInfoFields';
import { RelationshipSelect } from './RelationshipSelect';
import { PickupTypeSelect } from './PickupTypeSelect';
import { PickupNotesInput } from './PickupNotesInput';

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
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setPickupData(prev => ({ ...prev, [field]: value }));
  };

  const savePickupRecord = async (action: 'pickup' | 'dropoff') => {
    // Enhanced validation with specific field checks
    const missingFields = [];
    if (!pickupData.studentId.trim()) missingFields.push('Student ID');
    if (!pickupData.parentGuardianName.trim()) missingFields.push('Parent/Guardian Name');
    if (!pickupData.relationship.trim()) missingFields.push('Relationship');

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Validate student ID format (basic check)
    if (pickupData.studentId.length < 2) {
      toast({
        title: "Invalid Student ID",
        description: "Student ID must be at least 2 characters long",
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
        });

      if (error) {
        console.error('Error saving pickup record:', error);
        throw error;
      }

      toast({
        title: `${action === 'pickup' ? 'Pickup' : 'Drop-off'} Recorded Successfully!`,
        description: `${pickupData.studentId} has been ${action === 'pickup' ? 'picked up' : 'dropped off'} by ${pickupData.parentGuardianName}`,
        variant: "default"
      });

      // Reset form
      setPickupData({
        studentId: '',
        studentName: '',
        parentGuardianName: '',
        relationship: '',
        pickupType: '',
        notes: ''
      });

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
    <CardContent className="space-y-4">
      <PickupInfoFields
        studentName={pickupData.studentId}
        parentName={pickupData.parentGuardianName}
        onStudentNameChange={(value) => handleInputChange('studentId', value)}
        onParentNameChange={(value) => handleInputChange('parentGuardianName', value)}
      />
      
      <RelationshipSelect
        value={pickupData.relationship}
        onChange={(value) => handleInputChange('relationship', value)}
      />
      
      <PickupTypeSelect
        value={pickupData.pickupType}
        onChange={(value) => handleInputChange('pickupType', value)}
      />

      <PickupNotesInput
        value={pickupData.notes}
        onChange={(value) => handleInputChange('notes', value)}
      />

      <div className="flex space-x-3 pt-4">
        <Button 
          onClick={handlePickup}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Record Pickup
        </Button>
        <Button 
          onClick={handleDropoff}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Car className="h-4 w-4 mr-2" />
          Record Drop-off
        </Button>
      </div>
    </CardContent>
  );
}
