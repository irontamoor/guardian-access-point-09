
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react';

interface VisitorFormActionsProps {
  onRegister: () => void;
  loading: boolean;
}

export function VisitorFormActions({ onRegister, loading }: VisitorFormActionsProps) {
  return (
    <div className="flex space-x-3 pt-4">
      <Button 
        onClick={onRegister}
        className="flex-1 bg-purple-600 hover:bg-purple-700"
        disabled={loading}
      >
        <Badge className="h-4 w-4 mr-2" />
        {loading ? 'Registering...' : 'Register & Print Badge'}
      </Button>
    </div>
  );
}
