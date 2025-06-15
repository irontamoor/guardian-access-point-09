import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSignInOptions } from '@/hooks/useSignInOptions';

interface ParentPickupProps {
  onBack: () => void;
}

const ParentPickup = ({ onBack }: ParentPickupProps) => {
  const [pickupData, setPickupData] = useState({
    parentName: '',
    relationship: '', // NEW FIELD
    studentName: '',
    studentId: '',
    carRegistration: '',
    pickupType: '',
    notes: ''
  });
  const [notesError, setNotesError] = useState<string | null>(null);
  const [relationshipError, setRelationshipError] = useState<string | null>(null); // NEW STATE
  const { toast } = useToast();

  // --- NEW: Load dynamic pickup types ---
  const { options: pickupOptions, loading: pickupTypesLoading } = useSignInOptions("both", "pickup_type");

  // Default hardcoded types, only for compatibility/fallback if none found
  const fallbackTypes = [
    { value: "regular", label: "Regular Pickup" },
    { value: "early", label: "Early Dismissal" },
    { value: "medical", label: "Medical Appointment" },
    { value: "emergency", label: "Emergency Pickup" },
    { value: "dropoff", label: "Drop-off Only" },
    { value: "other", label: "Other" },
  ];

  // Build dynamic pickup type list, but always show at least fallback if none in DB
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

  // NEW VALIDATION for relationship
  const validateRelationship = () => {
    if (!pickupData.relationship.trim()) {
      setRelationshipError("Relationship to student is required.");
      return false;
    }
    setRelationshipError(null);
    return true;
  };

  const handleRequestPickup = () => {
    // Car Registration is optional
    if (!pickupData.parentName || !pickupData.studentName || !pickupData.studentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (!validateRelationship()) return; // NEW: Check relationship
    if (!validateNotes()) return;

    toast({
      title: "Pickup Request Submitted!",
      description: `${pickupData.studentName} will be notified. Please wait in the designated area.`,
      variant: "default"
    });

    // Reset form
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
    // Car Registration is optional
    if (!pickupData.studentName || !pickupData.studentId) {
      toast({
        title: "Error",
        description: "Please provide student information",
        variant: "destructive"
      });
      return;
    }
    if (!validateRelationship()) return; // NEW: Check relationship
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-orange-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-3 mb-2">
          <Car className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Parent Pickup & Drop-off</h1>
        </div>
        <p className="text-gray-600">Safe and secure child pickup and drop-off management</p>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 gap-6">
        {/* Pickup/Drop-off Form */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <span>Pickup/Drop-off Request</span>
            </CardTitle>
            <CardDescription>Please provide information for student pickup or drop-off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name *</Label>
              <Input
                id="parentName"
                placeholder="Enter your full name"
                value={pickupData.parentName}
                onChange={(e) => handleInputChange('parentName', e.target.value)}
              />
            </div>
            
            {/* NEW RELATIONSHIP FIELD */}
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Student *</Label>
              <Input
                id="relationship"
                placeholder="e.g. Mother, Uncle, Family Friend"
                value={pickupData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                className={relationshipError ? "border-red-500" : ""}
              />
              {relationshipError && (
                <div className="text-red-600 text-sm mt-1">{relationshipError}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student's name"
                  value={pickupData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID"
                  value={pickupData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carRegistration">Car Registration (optional)</Label>
              <Input
                id="carRegistration"
                placeholder="Enter car registration number"
                value={pickupData.carRegistration}
                onChange={(e) => handleInputChange('carRegistration', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupType">Pickup Type</Label>
              <Select
                value={pickupData.pickupType}
                onValueChange={(value) => setPickupData(prev => ({ ...prev, pickupType: value }))}
                disabled={pickupTypesLoading && pickupOptions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup type" />
                </SelectTrigger>
                <SelectContent>
                  {pickupTypeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">
                Additional Notes
                {isOtherPicked && <span className="text-red-600 ml-1">*</span>}
              </Label>
              <Input
                id="notes"
                placeholder={isOtherPicked ? "Describe details for 'Other' pickup type" : "Any special instructions or notes"}
                value={pickupData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className={isOtherPicked && notesError ? "border-red-500" : ""}
              />
              {notesError && (
                <div className="text-red-600 text-sm mt-1">{notesError}</div>
              )}
            </div>

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
          </CardContent>
        </Card>

        {/* Emergency Protocols */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Emergency Protocols</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-medium text-red-800 mb-1">Unauthorized Pickup Attempt</div>
                <div className="text-red-600">Contact school security immediately</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="font-medium text-yellow-800 mb-1">Student Not Found</div>
                <div className="text-yellow-600">Check attendance & notify administration</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-800 mb-1">Parent ID Required</div>
                <div className="text-blue-600">Always verify parent/guardian identity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentPickup;
