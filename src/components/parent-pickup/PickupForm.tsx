
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
    studentName: '',
    parentName: '',
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
    if (!pickupData.studentName || !pickupData.parentName || !pickupData.relationship) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const status = action === 'pickup' ? 'out' : 'in';
      
      // Create attendance record for parent pickup/dropoff with structured data
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: pickupData.studentName, // Store student ID as user_id
          first_name: pickupData.parentName, // Store parent name as first_name
          last_name: pickupData.relationship, // Store relationship as last_name
          status,
          check_in_time: action === 'dropoff' ? now : null,
          check_out_time: action === 'pickup' ? now : null,
          notes: pickupData.notes || '',
          organization: 'Parent Pickup/Dropoff',
          visit_purpose: action === 'pickup' ? 'Pickup' : 'Drop-off',
          phone_number: pickupData.pickupType || null,
          host_name: pickupData.parentName,
          purpose: `Student ${action}`,
          created_by: null,
          company: pickupData.pickupType // Store pickup type in company field
        });

      if (error) {
        console.error('Error saving pickup record:', error);
        throw error;
      }

      toast({
        title: `${action === 'pickup' ? 'Pickup' : 'Drop-off'} Recorded!`,
        description: `${pickupData.studentName} has been ${action === 'pickup' ? 'picked up' : 'dropped off'} by ${pickupData.parentName}`,
        variant: "default"
      });

      // Reset form
      setPickupData({
        studentName: '',
        parentName: '',
        relationship: '',
        pickupType: '',
        notes: ''
      });

    } catch (error: any) {
      console.error(`Error recording ${action}:`, error);
      toast({
        title: "Error",
        description: `Failed to record ${action}. Please try again.`,
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
        studentName={pickupData.studentName}
        parentName={pickupData.parentName}
        onStudentNameChange={(value) => handleInputChange('studentName', value)}
        onParentNameChange={(value) => handleInputChange('parentName', value)}
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
