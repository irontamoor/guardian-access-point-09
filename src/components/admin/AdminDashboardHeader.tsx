
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';

interface AdminDashboardHeaderProps {
  onBack: () => void;
  onLogout: () => void;
}

export function AdminDashboardHeader({ onBack, onLogout }: AdminDashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Main</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={onLogout}
        className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
}
