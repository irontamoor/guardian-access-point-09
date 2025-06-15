import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, User, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptions } from '@/hooks/useSignInOptions';
import { PickupTypeSelect } from './PickupTypeSelect';
import { PickupNotesInput } from './PickupNotesInput';
import { PickupInfoFields } from './PickupInfoFields';

export interface PickupFormProps {
  onBack: () => void;
}

const fallbackTypes = [
  { value: "regular", label: "Regular Pickup" },
  { value: "early", label: "Early Dismissal" },
  { value: "medical", label: "Medical Appointment" },
  { value: "emergency", label: "Emergency Pickup" },
  { value: "dropoff", label: "Drop-off Only" },
  { value: "other", label: "Other" },
];

export const PickupForm = ({ onBack }: PickupFormProps) => {
  const [pickupData, setPickupData] = useState({
    parentName: '',
    relationship: '',
    studentName: '',
    studentId: '',
    carRegistration: '',
    pickupType: '',
    notes: ''
  });
  const [notesError, setNotesError] = useState<string | null>(null);
  const [relationshipError, setRelationshipError] = useState<string | null>(null);
  const { toast } = useToast();
  const { options: pickupOptions, loading: pickupTypesLoading } = useSignInOptions("both", "pickup_type");

  const pickupTypeOptions =
    pickupOptions.length > 0
      ? pickupOptions.map(o => ({
          value: o.label.toLowerCase().replace(/\s+/g, "_"),
          label: o.label,
        }))
      : fallbackTypes;

  const isOtherPicked = pickupData.pickupType === "other";

  const handleInputChange = (field: string, value: string) => {
    setPickupData(prev => ({ ...prev, [field]: value }));
    if (field === "notes" && value.trim() !== "") {
      setNotesError(null);
    }
    if (field === "relationship" && value.trim() !== "") {
      setRelationshipError(null);
    }
  };

  const validateNotes = () => {
    if (pickupData.pickupType === "other" && !pickupData.notes.trim()) {
      setNotesError("Notes are required when 'Other' pickup type is selected.");
      return false;
    }
    setNotesError(null);
    return true;
  };

  const validateRelationship = () => {
    if (!pickupData.relationship.trim()) {
      setRelationshipError("Relationship to student is required.");
      return false;
    }
    setRelationshipError(null);
    return true;
  };

  const handleRequestPickup = () => {
    if (!pickupData.parentName || !pickupData.studentName || !pickupData.studentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (!validateRelationship()) return;
    if (!validateNotes()) return;

    toast({
      title: "Pickup Request Submitted!",
      description: `${pickupData.studentName} will be notified. Please wait in the designated area.`,
      variant: "default"
    });

    setPickupData({
      parentName: '',
      relationship: '',
      studentName: '',
      studentId: '',
      carRegistration: '',
      pickupType: '',
      notes: ''
    });
    setNotesError(null);
    setRelationshipError(null);
  };

  const handleDropOff = () => {
    if (!pickupData.studentName || !pickupData.studentId) {
      toast({
        title: "Error",
        description: "Please provide student information",
        variant: "destructive"
      });
      return;
    }
    if (!validateRelationship()) return;
    if (!validateNotes()) return;

    toast({
      title: "Drop-off Complete!",
      description: `${pickupData.studentName} has been safely dropped off`,
      variant: "default"
    });

    setPickupData({
      parentName: '',
      relationship: '',
      studentName: '',
      studentId: '',
      carRegistration: '',
      pickupType: '',
      notes: ''
    });
    setNotesError(null);
    setRelationshipError(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="border-l-4 border-l-orange-500 rounded-lg shadow-sm bg-card">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center space-x-2 text-2xl font-semibold">
            <User className="h-5 w-5 text-orange-600" />
            <span>Pickup/Drop-off Request</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Please provide information for student pickup or drop-off
          </div>
        </div>
        <div className="p-6 pt-0 space-y-4">
          <PickupInfoFields
            parentName={pickupData.parentName}
            relationship={pickupData.relationship}
            relationshipError={relationshipError}
            studentName={pickupData.studentName}
            studentId={pickupData.studentId}
            carRegistration={pickupData.carRegistration}
            onChange={handleInputChange}
          />
          <PickupTypeSelect
            value={pickupData.pickupType}
            onChange={val => setPickupData(prev => ({ ...prev, pickupType: val }))}
            options={pickupTypeOptions}
            loading={pickupTypesLoading && pickupOptions.length === 0}
          />
          <PickupNotesInput
            value={pickupData.notes}
            required={isOtherPicked}
            error={notesError}
            onChange={val => handleInputChange('notes', val)}
          />
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleRequestPickup}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Car className="h-4 w-4 mr-2" />
              Request Pickup
            </Button>
            <Button 
              onClick={handleDropOff}
              variant="outline"
              className="flex-1 border-green-300 text-green-600 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Drop-off
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
