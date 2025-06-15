
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase } from 'lucide-react';

interface StaffSignInHeaderProps {
  onBack: () => void;
}

const StaffSignInHeader = ({ onBack }: StaffSignInHeaderProps) => (
  <div className="max-w-4xl mx-auto mb-6">
    <Button 
      variant="ghost" 
      onClick={onBack}
      className="mb-4 hover:bg-green-100"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
    <div className="flex items-center space-x-3 mb-2">
      <Briefcase className="h-8 w-8 text-green-600" />
      <h1 className="text-3xl font-bold text-gray-900">Staff Sign-In/Out</h1>
    </div>
    <p className="text-gray-600">Employee attendance and time tracking system</p>
  </div>
);

export default StaffSignInHeader;
