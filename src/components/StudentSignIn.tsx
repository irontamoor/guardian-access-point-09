
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Scan, UserCheck, UserX, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentSignInProps {
  onBack: () => void;
}

const StudentSignIn = ({ onBack }: StudentSignInProps) => {
  const [studentId, setStudentId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isScanning, setIsScanning] = useState(false);
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
      description: `Student ${studentId} signed in successfully`,
      variant: "default"
    });
    
    setStudentId('');
    setSelectedGrade('');
  };

  const handleSignOut = () => {
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
    setSelectedGrade('');
  };

  const simulateBarcodeScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setStudentId('STU' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
      setSelectedGrade('Grade 5');
      setIsScanning(false);
      toast({
        title: "Barcode Scanned",
        description: "Student information loaded",
        variant: "default"
      });
    }, 2000);
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

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sign In/Out Form */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <span>Student Information</span>
            </CardTitle>
            <CardDescription>Enter student details or scan ID card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="studentId"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={simulateBarcodeScan}
                  disabled={isScanning}
                  className="px-3"
                >
                  <Scan className={`h-4 w-4 ${isScanning ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Class</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="Grade 1">Grade 1</SelectItem>
                  <SelectItem value="Grade 2">Grade 2</SelectItem>
                  <SelectItem value="Grade 3">Grade 3</SelectItem>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                  <SelectItem value="Grade 5">Grade 5</SelectItem>
                  <SelectItem value="Grade 6">Grade 6</SelectItem>
                  <SelectItem value="Grade 7">Grade 7</SelectItem>
                  <SelectItem value="Grade 8">Grade 8</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest student check-ins and check-outs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'STU1234', name: 'Emma Johnson', grade: 'Grade 5', action: 'Signed In', time: '8:15 AM', status: 'in' },
                { id: 'STU5678', name: 'Michael Chen', grade: 'Grade 7', action: 'Signed Out', time: '3:30 PM', status: 'out' },
                { id: 'STU9012', name: 'Sofia Rodriguez', grade: 'Grade 3', action: 'Signed In', time: '8:45 AM', status: 'in' },
                { id: 'STU3456', name: 'James Wilson', grade: 'Grade 6', action: 'Signed In', time: '8:22 AM', status: 'in' },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">{record.id} • {record.grade}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${record.status === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.action}
                    </div>
                    <div className="text-xs text-gray-500">{record.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentSignIn;
