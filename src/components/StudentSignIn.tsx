import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserCheck, UserX, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface StudentSignInProps {
  onBack: () => void;
}

const StudentSignIn = ({ onBack }: StudentSignInProps) => {
  const [studentCode, setStudentCode] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Validate student code: any non-empty string
  const isValidCode = (str: string) => !!str.trim();

  // Fetch active student by code
  const fetchStudentUser = async (code: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", code)
      .eq("role", "student")
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  // Helper: Check if student has signed in today
  const hasTodaySignIn = async (user_id: string) => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const { data, error } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("user_id", user_id)
      .eq("status", "in")
      .gte("check_in_time", start.toISOString())
      .lte("check_in_time", end.toISOString())
      .maybeSingle();
    if (error) return false;
    return !!data;
  };

  const createAttendanceRecord = async (user_id: string, status: "in" | "out") => {
    const now = new Date().toISOString();
    const payload = {
      user_id,
      status,
      ...(status === "in" ? { check_in_time: now } : { check_out_time: now })
    };
    const { error } = await supabase.from("attendance_records").insert(payload);
    if (error) throw error;
  };

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
      </div>
    </div>
  );
};

export default StudentSignIn;
