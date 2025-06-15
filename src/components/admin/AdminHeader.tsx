
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Users } from 'lucide-react';

interface AdminHeaderProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { first_name?: string; last_name?: string; role: string };
}

export function AdminHeader({ onBack, onLogout, adminData }: AdminHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="hover:bg-purple-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {adminData.first_name} {adminData.last_name}
          </span>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-3 mb-2">
        <Users className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <p className="text-gray-600">Manage users, attendance, and system settings</p>
    </div>
  );
}
