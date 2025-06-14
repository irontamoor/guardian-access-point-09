import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, UserCheck, UserX, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentSignInProps {
  onBack: () => void;
}

const StudentSignIn = ({ onBack }: StudentSignInProps) => {
  const [studentId, setStudentId] = useState('');
  const [studentType, setStudentType] = useState<'day' | 'onboard'>('day');
  const { toast } = useToast();

  const handleSignIn = () => {
    if (!studentId) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Student ${studentId} (${studentType === 'onboard' ? 'On Board' : 'Day'}) signed in successfully`,
      variant: "default"
    });
    
    setStudentId('');
  };

  const handleSignOut = () => {
    if (studentType === 'onboard') {
      toast({
        title: "Not Required",
        description: "On Board students do not need to sign out each day.",
        variant: "default"
      });
      return;
    }

    if (!studentId) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Student ${studentId} signed out successfully`,
      variant: "default"
    });
    
    setStudentId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-blue-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Student Check-In/Out</h1>
        </div>
        <p className="text-gray-600">Track student arrivals and departures safely and efficiently</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Sign In/Out Form */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <span>Student Information</span>
            </CardTitle>
            <CardDescription>Enter student ID and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Student Type</Label>
              <RadioGroup
                value={studentType}
                onValueChange={val => setStudentType(val as 'day' | 'onboard')}
                className="flex space-x-6 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="day" id="student-type-day" />
                  <Label htmlFor="student-type-day">Day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onboard" id="student-type-onboard" />
                  <Label htmlFor="student-type-onboard">On Board</Label>
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
                disabled={studentType === 'onboard'}
                title={studentType === 'onboard' ? "On Board students do not need to sign out" : ""}
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

export default StudentSignIn;
