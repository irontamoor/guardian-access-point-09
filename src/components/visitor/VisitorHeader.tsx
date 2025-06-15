
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';

interface VisitorHeaderProps {
  onBack: () => void;
}

export function VisitorHeader({ onBack }: VisitorHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto mb-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-purple-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="flex items-center space-x-3 mb-2">
        <UserPlus className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Visitor Registration</h1>
      </div>
      <p className="text-gray-600">Register visitors and print security badges</p>
    </div>
  );
}
