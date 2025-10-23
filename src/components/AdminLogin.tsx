
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, KeyRound, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: (adminData: any) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!adminId || !password) {
      toast({
        title: "Error",
        description: "Please enter both Admin ID and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use secure authentication function (server-side credential verification)
      const { data, error } = await supabase
        .rpc('verify_admin_credentials', {
          p_admin_id: adminId,
          p_password: password
        });

      if (error || !data || data.length === 0) {
        toast({
          title: "Login Failed",
          description: "Invalid Admin ID or password",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Get the first result (function returns array)
      const adminData = data[0];

      toast({
        title: "Login Successful",
        description: `Welcome, ${adminData.first_name}!`,
        variant: "default"
      });

      setTimeout(() => {
        onLogin({
          id: adminData.id,
          admin_id: adminData.admin_id || adminData.user_code,
          email: adminData.email,
          role: adminData.role,
          first_name: adminData.first_name,
        });
        setIsLoading(false);
      }, 500);

    } catch (err: any) {
      toast({
        title: "Database Connection Error",
        description: "Could not connect to database. Please check your database configuration.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-l-4 border-l-blue-600">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
          <CardDescription>Please enter your Admin ID and password to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminId">Admin ID</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="adminId"
                placeholder="Enter Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            type="button"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <div className="border-t pt-4 mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/docs'}
              type="button"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
