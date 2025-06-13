
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserCheck, UserX, Briefcase, Clock, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StaffSignInProps {
  onBack: () => void;
}

const StaffSignIn = ({ onBack }: StaffSignInProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
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
      description: `Employee ${employeeId} signed in successfully`,
      variant: "default"
    });
    
    setEmployeeId('');
    setSelectedDepartment('');
  };

  const handleSignOut = () => {
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
    setSelectedDepartment('');
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

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sign In/Out Form */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Badge className="h-5 w-5 text-green-600" />
              <span>Employee Information</span>
            </CardTitle>
            <CardDescription>Enter your employee details to sign in or out</CardDescription>
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
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="elementary">Elementary Education</SelectItem>
                  <SelectItem value="middle">Middle School</SelectItem>
                  <SelectItem value="high">High School</SelectItem>
                  <SelectItem value="special-education">Special Education</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="food-service">Food Service</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="counseling">Counseling</SelectItem>
                  <SelectItem value="library">Library</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
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
              >
                <UserX className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Staff Status</span>
            </CardTitle>
            <CardDescription>Current staff attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'EMP001', name: 'Sarah Miller', dept: 'Elementary', status: 'Present', time: '7:45 AM' },
                { id: 'EMP002', name: 'David Thompson', dept: 'Administration', status: 'Present', time: '8:00 AM' },
                { id: 'EMP003', name: 'Lisa Garcia', dept: 'Middle School', status: 'Present', time: '7:55 AM' },
                { id: 'EMP004', name: 'Robert Kim', dept: 'Maintenance', status: 'Present', time: '7:30 AM' },
                { id: 'EMP005', name: 'Maria Santos', dept: 'Food Service', status: 'Present', time: '6:45 AM' },
              ].map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-500">{staff.id} • {staff.dept}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{staff.status}</div>
                    <div className="text-xs text-gray-500">Since {staff.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-400">3</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffSignIn;
