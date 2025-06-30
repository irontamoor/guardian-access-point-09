
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface HomeAdminAccessProps {
  onViewChange: (view: string) => void;
}

export function HomeAdminAccess({ onViewChange }: HomeAdminAccessProps) {
  return (
    <div className="text-center">
      <Button 
        variant="outline" 
        onClick={() => onViewChange('admin-login')}
        className="inline-flex items-center space-x-2"
      >
        <Users className="h-4 w-4" />
        <span>Admin Dashboard</span>
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        Access user management, attendance editing, and system settings
      </p>
    </div>
  );
}
