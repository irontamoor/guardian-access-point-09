
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';

interface StaffSignInButtonsProps {
  onSignIn: () => void;
  onSignOut: () => void;
  loading: boolean;
}

export function StaffSignInButtons({ onSignIn, onSignOut, loading }: StaffSignInButtonsProps) {
  return (
    <div className="flex space-x-3 pt-4">
      <Button 
        onClick={onSignIn}
        disabled={loading}
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Sign In
      </Button>
      <Button 
        onClick={onSignOut}
        disabled={loading}
        variant="outline"
        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
      >
        <UserX className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
