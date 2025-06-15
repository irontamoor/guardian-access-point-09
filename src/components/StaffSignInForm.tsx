
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, UserX, Badge } from 'lucide-react';
import { useStaffAttendance } from '@/hooks/useStaffAttendance';

// Quick pick reasons for sign-in/out
const QUICK_REASONS = [
  "Late",
  "Medical Appointment",
  "Personal Day",
  "Meeting",
  "Sick",
  "Other"
];

interface StaffSignInFormProps {
  onSuccess?: () => void;
}

const StaffSignInForm = ({ onSuccess }: StaffSignInFormProps) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [notes, setNotes] = useState('');
  const {
    loading, setLoading,
    isValidCode, fetchStaffUser, hasTodaySignIn, createAttendanceRecord, toast
  } = useStaffAttendance();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (!isValidCode(employeeCode)) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await createAttendanceRecord(staff.id, "in", notes);

      toast({
        title: "Welcome!",
        description: `Employee ${employeeCode} signed in successfully`,
        variant: "default"
      });
      setEmployeeCode('');
      setNotes('');
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
      if (!isValidCode(employeeCode)) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeCode);
      if (!staff) {
        toast({
          title: "User does not exist",
          description: "User does not exist. See Admin Team.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const signedInToday = await hasTodaySignIn(staff.id);

      await createAttendanceRecord(staff.id, "out", notes);

      if (!signedInToday) {
        toast({
          title: "You forgot to sign in",
          description: "Make sure to sign in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Have a great day!",
          description: `Employee ${employeeCode} signed out successfully`,
          variant: "default"
        });
      }
      setEmployeeCode('');
      setNotes('');
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
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Badge className="h-5 w-5 text-green-600" />
          <span>Employee Information</span>
        </CardTitle>
        <CardDescription>Enter your employee ID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employeeCode">Employee ID</Label>
          <Input
            id="employeeCode"
            placeholder="Enter employee ID"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Reason / Comment</Label>
          <Textarea
            id="notes"
            placeholder="E.g. Late, Medical Appointment"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-2 mt-1">
            {QUICK_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                className="text-xs px-2 py-1 bg-gray-100 rounded border hover:bg-green-100 text-gray-700"
                onClick={() => setNotes((prev) => prev ? prev + ', ' + reason : reason)}
                disabled={loading}
              >
                {reason}
              </button>
            ))}
          </div>
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

export default StaffSignInForm;
