import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Use a fixed list of allowed admin IDs for demonstration
const ALLOWED_ADMIN_IDS = ['admin123', 'masteradmin', 'schooladmin'];

const DUMMY_ADMIN_USER = {
  id: 'admin-dummy',
  aud: 'authenticated',
  admin_id: '',
  role: 'admin',
  created_at: '',
  // other fields can be added as required
};

interface AdminLoginProps {
  onLogin: (adminData: any) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [adminId, setAdminId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!adminId) {
      toast({
        title: "Error",
        description: "Please enter your Admin ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Only allow login if adminId matches allowed list
      if (ALLOWED_ADMIN_IDS.includes(adminId.trim().toLowerCase())) {
        toast({
          title: "Welcome!",
          description: `Admin ${adminId} logged in`,
          variant: "default"
        });
        onLogin({ ...DUMMY_ADMIN_USER, admin_id: adminId, email: `${adminId}@admin.local` });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid Admin ID",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 700);
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
          <CardDescription>Please enter your Admin ID to access the dashboard</CardDescription>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
