
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car } from 'lucide-react';
import { ParentPickupCard } from './parent-pickup/ParentPickupCard';

interface ParentPickupProps {
  onBack: () => void;
}

const ParentPickup = ({ onBack }: ParentPickupProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto mb-6">
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
        <p className="text-gray-600">Secure student pickup and drop-off management</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <ParentPickupCard />
      </div>
    </div>
  );
};

export default ParentPickup;
