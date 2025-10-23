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
            onClick={() => setShowHelp(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 px-4 py-2"
            title="Learn how to use parent pickup"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="hidden sm:inline font-semibold">Need Help?</span>
            <span className="sm:hidden font-semibold">Help</span>
          </Button>
        </div>
        <p className="text-gray-600">Secure student pickup and drop-off management</p>
      </CardHeader>

      <ParentPickupHelp open={showHelp} onOpenChange={setShowHelp} />
    </>
  );
}
