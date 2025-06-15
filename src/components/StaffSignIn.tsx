
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
  const [employeeId, setEmployeeId] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Helper: Validate employee by id in DB
  const fetchStaffUser = async (id: string) => {
    const { data, error } = await supabase
      .from("system_users")
      .select("*")
      .eq("id", id)
      .eq("role", "staff")
      .maybeSingle();
    if (error) throw error;
    return data;
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
      if (!employeeId) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeId);
      if (!staff) {
        toast({
          title: "Not found",
          description: "No staff found with that employee ID.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await createAttendanceRecord(employeeId, "in");

      toast({
        title: "Welcome!",
        description: `Employee ${employeeId} signed in successfully`,
        variant: "default"
      });
      setEmployeeId('');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (!employeeId) {
        toast({
          title: "Error",
          description: "Please enter an employee ID",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const staff = await fetchStaffUser(employeeId);
      if (!staff) {
        toast({
          title: "Not found",
          description: "No staff found with that employee ID.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      await createAttendanceRecord(employeeId, "out");

      toast({
        title: "Have a great day!",
        description: `Employee ${employeeId} signed out successfully`,
        variant: "default"
      });
      setEmployeeId('');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
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
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
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
