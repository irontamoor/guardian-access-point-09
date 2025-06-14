
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createAdminAuth } from '@/utils/setupAdmin';

const AdminSetup = () => {
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [lastError, setLastError] = useState<string | null>(null);

  const handleSetup = async () => {
    setIsLoading(true);
    setLastError(null);
    try {
      const result = await createAdminAuth();
      if (result.success) {
        setIsSetup(true);
        toast({
          title: "Admin Setup Complete!",
          description: "Admin user created successfully. You can now log in.",
          variant: "default"
        });
      } else if (result.resetEmail) {
        toast({
          title: "Password Reset Email Sent",
          description: "A password reset email was sent to admin@school.com since the account already exists.",
          variant: "default"
        });
        setLastError("Admin user already exists. Password reset email sent.");
      } else {
        setLastError(result.error || "Failed to setup admin user");
        toast({
          title: "Setup Error",
          description: result.error || "Failed to setup admin user",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      setLastError(error.message || "Failed to setup admin user");
      toast({
        title: "Setup Error",
        description: error.message || "Failed to setup admin user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSetup) {
    return (
      <Card className="w-full max-w-md border-l-4 border-l-green-600">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Admin Ready!
          </CardTitle>
          <CardDescription>
            Admin credentials:
            <br />
            <strong>Email:</strong> admin@school.com
            <br />
            <strong>Password:</strong> admin123
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-l-4 border-l-blue-600">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          Setup Admin User
        </CardTitle>
        <CardDescription>
          Create authentication credentials for the admin user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleSetup}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          data-testid="admin-setup-btn"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Setting up...</span>
            </div>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Setup Admin User
            </>
          )}
        </Button>
        {lastError && (
          <div className="mt-2 text-sm text-red-600 text-center">
            {lastError}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSetup;

