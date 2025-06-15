import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UserCheck, UserX, Briefcase, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface StaffSignInProps {
  onBack: () => void;
}

const StaffSignIn = ({ onBack }: StaffSignInProps) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Validate staff code: any non-empty string
  const isValidCode = (str: string) => !!str.trim();

  // Fetch active staff by code
  const fetchStaffUser = async (code: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("user_code", code)
      .eq("role", "staff")
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  // Helper: Check if staff has signed in today
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

      await createAttendanceRecord(staff.id, "in");

      toast({
        title: "Welcome!",
        description: `Employee ${employeeCode} signed in successfully`,
        variant: "default"
      });
      setEmployeeCode('');
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

      // Check if they signed in today
      const signedInToday = await hasTodaySignIn(staff.id);

      await createAttendanceRecord(staff.id, "out");

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

export default StaffSignIn;
