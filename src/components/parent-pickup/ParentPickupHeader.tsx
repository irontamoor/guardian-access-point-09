
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car } from 'lucide-react';

export interface ParentPickupHeaderProps {
  onBack: () => void;
}

export const ParentPickupHeader = ({ onBack }: ParentPickupHeaderProps) => (
  <>
    <Button 
      variant="ghost" 
      onClick={onBack}
      className="mb-4 hover:bg-orange-100"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </Button>
    
    <div className="flex items-center space-x-3 mb-2">
      <Car className="h-8 w-8 text-orange-600" />
      <h1 className="text-3xl font-bold text-gray-900">Parent Pickup & Drop-off</h1>
    </div>
    <p className="text-gray-600">Safe and secure child pickup and drop-off management</p>
  </>
);
