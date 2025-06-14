import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, UserCheck, UserX, Briefcase, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StaffSignInProps {
  onBack: () => void;
}

const StaffSignIn = ({ onBack }: StaffSignInProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [staffType, setStaffType] = useState<'day' | 'onboard'>('day');
  const { toast } = useToast();

  const handleSignIn = () => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Please enter an employee ID",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Welcome!",
      description: `Employee ${employeeId} (${staffType === 'onboard' ? 'On Board' : 'Day'}) signed in successfully`,
      variant: "default"
    });
    
    setEmployeeId('');
  };

  const handleSignOut = () => {
    if (staffType === 'onboard') {
      toast({
        title: "Not Required",
        description: "On Board staff do not need to sign out each day.",
        variant: "default"
      });
      return;
    }

    if (!employeeId) {
      toast({
        title: "Error",
        description: "Please enter an employee ID",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Have a great day!",
      description: `Employee ${employeeId} signed out successfully`,
      variant: "default"
    });
    
    setEmployeeId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-green-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-3 mb-2">
          <Briefcase className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Staff Sign-In/Out</h1>
        </div>
        <p className="text-gray-600">Employee attendance and time tracking system</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Sign In/Out Form */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Badge className="h-5 w-5 text-green-600" />
              <span>Employee Information</span>
            </CardTitle>
            <CardDescription>Enter your employee ID and select type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Staff Type</Label>
              <RadioGroup
                value={staffType}
                onValueChange={val => setStaffType(val as 'day' | 'onboard')}
                className="flex space-x-6 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="staff-type-day" />
                  <Label htmlFor="staff-type-day">Day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onboard" id="staff-type-onboard" />
                  <Label htmlFor="staff-type-onboard">On Board</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleSignIn}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                disabled={staffType === 'onboard'}
                title={staffType === 'onboard' ? "On Board staff do not need to sign out" : ""}
              >
                <UserX className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffSignIn;
