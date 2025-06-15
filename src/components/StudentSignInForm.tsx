
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCheck, UserX } from 'lucide-react';
import { useStudentAttendance } from '@/hooks/useStudentAttendance';

interface StudentSignInFormProps {
  onSuccess?: () => void;
}

const StudentSignInForm = ({ onSuccess }: StudentSignInFormProps) => {
  const [studentCode, setStudentCode] = useState('');
  const {
    loading, setLoading,
    isValidCode, fetchStudentUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStudentAttendance();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!isValidCode(studentCode)) {
        toast({
          title: "Error",
          description: "Please enter a student ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const student = await fetchStudentUser(studentCode);
      if (!student) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await createAttendanceRecord(student.id, "in");

      toast({
        title: "Success!",
        description: `Student ${studentCode} signed in successfully`,
        variant: "default"
      });
      setStudentCode('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || "Unknown error.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (!isValidCode(studentCode)) {
        toast({
          title: "Error",
          description: "Please enter a student ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const student = await fetchStudentUser(studentCode);
      if (!student) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check if they signed in today
      const signedInToday = await hasTodaySignIn(student.id);

      await createAttendanceRecord(student.id, "out");

      if (!signedInToday) {
        toast({
          title: "You forgot to sign in",
          description: "Make sure to sign in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: `Student ${studentCode} signed out successfully`,
          variant: "default"
        });
      }
      setStudentCode('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.message || "Unknown error.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <span>Student Information</span>
        </CardTitle>
        <CardDescription>Enter student ID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentCode">Student ID</Label>
          <Input
            id="studentCode"
            placeholder="Enter student ID"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>
        <div className="flex space-x-3 pt-4">
          <Button 
            onClick={handleSignIn}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button 
            onClick={handleSignOut}
            disabled={loading}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <UserX className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSignInForm;
