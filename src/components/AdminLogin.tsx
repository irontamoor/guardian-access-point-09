
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ensureDemoUser } from '@/utils/setupAdmin';

interface AdminLoginProps {
  onLogin: (adminData: { username: string; role: string }) => void;
}

const DEMO_CREDENTIALS_KEY = "hideDemoCreds";

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showDemo, setShowDemo] = useState<boolean>(() => {
    return !localStorage.getItem(DEMO_CREDENTIALS_KEY);
  });
  const [demoInfo, setDemoInfo] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    // Try to ensure demo user exists on mount
    ensureDemoUser().then(setDemoInfo);
  }, []);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate authentication - in real implementation, this would call Supabase
    setTimeout(() => {
      if (
        (credentials.username === (demoInfo?.email || '') && credentials.password === (demoInfo?.password || '')) ||
        (credentials.username === 'admin' && credentials.password === 'admin123')
      ) {
        toast({
          title: "Welcome!",
          description: "Successfully logged in to admin dashboard",
          variant: "default"
        });
        onLogin({ username: credentials.username, role: 'admin' });

        // If user checked "Hide demo credentials", remember their choice
        if (!showDemo) {
          localStorage.setItem(DEMO_CREDENTIALS_KEY, "1");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleHideDemoOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDemo(!event.target.checked);
    if (event.target.checked) {
      localStorage.setItem(DEMO_CREDENTIALS_KEY, "1");
    } else {
      localStorage.removeItem(DEMO_CREDENTIALS_KEY);
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
          <CardDescription>Please sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                placeholder="Enter admin username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
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

          {showDemo && demoInfo && (
            <div className="text-center mt-6 border rounded-md p-3 bg-blue-50">
              <p className="text-sm font-semibold mb-2">Demo Admin Credentials:</p>
              <div className="flex flex-col items-center gap-1 text-xs">
                <span>
                  <strong>Username:</strong> {demoInfo.email}
                </span>
                <span>
                  <strong>Password:</strong> {demoInfo.password}
                </span>
                <label className="mt-2 flex items-center gap-1 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!showDemo}
                    onChange={handleHideDemoOption}
                    className="mr-1"
                  />
                  Hide demo credentials after login
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
