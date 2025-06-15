
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ParentPickupHeaderProps {
  onBack: () => void;
}

export function ParentPickupHeader({ onBack }: ParentPickupHeaderProps) {
  return (
    <CardHeader>
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 hover:bg-orange-100 self-start"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="flex items-center space-x-3 mb-2">
        <Car className="h-8 w-8 text-orange-600" />
        <CardTitle className="text-3xl font-bold text-gray-900">Parent Pickup & Drop-off</CardTitle>
      </div>
      <p className="text-gray-600">Secure student pickup and drop-off management</p>
    </CardHeader>
  );
}
