
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface StudentSignInHeaderProps {
  onBack: () => void;
}

const StudentSignInHeader = ({ onBack }: StudentSignInHeaderProps) => (
  <div className="max-w-4xl mx-auto mb-6">
    <Button 
      variant="ghost" 
      onClick={onBack}
      className="mb-4 hover:bg-blue-100"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
    <div className="flex items-center space-x-3 mb-2">
      <BookOpen className="h-8 w-8 text-blue-600" />
      <h1 className="text-3xl font-bold text-gray-900">Student Check-In/Out</h1>
    </div>
    <p className="text-gray-600">Track student arrivals and departures safely and efficiently</p>
  </div>
);

export default StudentSignInHeader;
