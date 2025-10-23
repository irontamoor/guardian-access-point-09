import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, HelpCircle } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ParentPickupHelp } from './ParentPickupHelp';

interface ParentPickupHeaderProps {
  onBack: () => void;
}

export function ParentPickupHeader({ onBack }: ParentPickupHeaderProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <CardHeader>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-orange-100 self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-orange-600" />
            <CardTitle className="text-3xl font-bold text-gray-900">Parent Pickup & Drop-off</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowHelp(true)}
            className="hover:bg-orange-100 text-orange-600"
            title="How to use this page"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-gray-600">Secure student pickup and drop-off management</p>
      </CardHeader>

      <ParentPickupHelp open={showHelp} onOpenChange={setShowHelp} />
    </>
  );
}
