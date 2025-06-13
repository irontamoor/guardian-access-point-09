
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Car, User, Clock, CheckCircle, AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParentPickupProps {
  onBack: () => void;
}

const ParentPickup = ({ onBack }: ParentPickupProps) => {
  const [pickupData, setPickupData] = useState({
    parentName: '',
    studentName: '',
    studentId: '',
    carRegistration: '',
    pickupType: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setPickupData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestPickup = () => {
    if (!pickupData.parentName || !pickupData.studentName || !pickupData.studentId || !pickupData.carRegistration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including car registration",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pickup Request Submitted!",
      description: `${pickupData.studentName} will be notified. Please wait in the designated area.`,
      variant: "default"
    });
    
    // Reset form
    setPickupData({
      parentName: '',
      studentName: '',
      studentId: '',
      carRegistration: '',
      pickupType: '',
      notes: ''
    });
  };

  const handleDropOff = () => {
    if (!pickupData.studentName || !pickupData.studentId || !pickupData.carRegistration) {
      toast({
        title: "Error",
        description: "Please provide student information and car registration",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Drop-off Complete!",
      description: `${pickupData.studentName} has been safely dropped off`,
      variant: "default"
    });
    
    setPickupData({
      parentName: '',
      studentName: '',
      studentId: '',
      carRegistration: '',
      pickupType: '',
      notes: ''
    });
  };

  const handleEmergencyContact = (student: string) => {
    toast({
      title: "Emergency Contact Initiated",
      description: `Calling emergency contact for ${student}`,
      variant: "default"
    });
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Label htmlFor="carRegistration">Car Registration *</Label>
              <Input
                id="carRegistration"
                placeholder="Enter car registration number"
                value={pickupData.carRegistration}
                onChange={(e) => handleInputChange('carRegistration', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupType">Pickup Type</Label>
              <Select value={pickupData.pickupType} onValueChange={(value) => handleInputChange('pickupType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Pickup</SelectItem>
                  <SelectItem value="early">Early Dismissal</SelectItem>
                  <SelectItem value="medical">Medical Appointment</SelectItem>
                  <SelectItem value="emergency">Emergency Pickup</SelectItem>
                  <SelectItem value="dropoff">Drop-off Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Input
                id="notes"
                placeholder="Any special instructions or notes"
                value={pickupData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
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

        {/* Pickup Queue & Status */}
        <div className="space-y-6">
          {/* Current Pickup Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Pickup Queue</span>
              </CardTitle>
              <CardDescription>Students waiting for pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    student: 'Emma Thompson', 
                    id: 'STU1234', 
                    parent: 'Sarah Thompson', 
                    time: '3:15 PM', 
                    status: 'waiting',
                    location: 'Main Office'
                  },
                  { 
                    student: 'Michael Chen', 
                    id: 'STU5678', 
                    parent: 'David Chen', 
                    time: '3:20 PM', 
                    status: 'called',
                    location: 'Front Door'
                  },
                  { 
                    student: 'Sofia Rodriguez', 
                    id: 'STU9012', 
                    parent: 'Maria Rodriguez', 
                    time: '3:25 PM', 
                    status: 'waiting',
                    location: 'Nurse Office'
                  },
                ].map((pickup, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{pickup.student}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pickup.status === 'waiting' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {pickup.status === 'waiting' ? 'Waiting' : 'Called'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      ID: {pickup.id} • Parent: {pickup.parent}
                    </div>
                    <div className="text-xs text-gray-400 mb-3">
                      Requested: {pickup.time} • Location: {pickup.location}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => toast({
                          title: "Pickup Completed",
                          description: `${pickup.student} has been picked up`,
                          variant: "default"
                        })}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEmergencyContact(pickup.student)}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default ParentPickup;
