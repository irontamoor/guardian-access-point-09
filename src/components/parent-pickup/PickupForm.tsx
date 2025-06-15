
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PickupInfoFields } from './PickupInfoFields';
import { PickupTypeSelect } from './PickupTypeSelect';
import { PickupNotesInput } from './PickupNotesInput';

interface PickupFormProps {
  onBack: () => void;
}

export function PickupForm({ onBack }: PickupFormProps) {
  const [pickupData, setPickupData] = useState({
    studentName: '',
    parentName: '',
    pickupType: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setPickupData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickup = () => {
    if (!pickupData.studentName || !pickupData.parentName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pickup Recorded!",
      description: `${pickupData.studentName} has been picked up by ${pickupData.parentName}`,
      variant: "default"
    });

    setPickupData({
      studentName: '',
      parentName: '',
      pickupType: '',
      notes: ''
    });
  };

  const handleDropoff = () => {
    if (!pickupData.studentName || !pickupData.parentName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Drop-off Recorded!",
      description: `${pickupData.studentName} has been dropped off by ${pickupData.parentName}`,
      variant: "default"
    });

    setPickupData({
      studentName: '',
      parentName: '',
      pickupType: '',
      notes: ''
    });
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-orange-600" />
          <span>Pickup/Drop-off Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PickupInfoFields
          studentName={pickupData.studentName}
          parentName={pickupData.parentName}
          onStudentNameChange={(value) => handleInputChange('studentName', value)}
          onParentNameChange={(value) => handleInputChange('parentName', value)}
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
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Record Pickup
          </Button>
          <Button 
            onClick={handleDropoff}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Car className="h-4 w-4 mr-2" />
            Record Drop-off
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
