import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ParentPickupHeader } from './ParentPickupHeader';
import { PickupForm } from './PickupForm';
import { PickupStatusLookup } from './PickupStatusLookup';

interface ParentPickupCardProps {
  onBack?: () => void;
}

export function ParentPickupCard({ onBack }: ParentPickupCardProps) {
  const [showStatusLookup, setShowStatusLookup] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <>
      <Card className="border-l-4 border-l-orange-500">
        <ParentPickupHeader onBack={handleBack} />
        <PickupForm onBack={handleBack} />
        
        <div className="p-6 pt-0 border-t mt-6">
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowStatusLookup(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Check Pickup Status
            </Button>
          </div>
        </div>
      </Card>

      <PickupStatusLookup 
        open={showStatusLookup} 
        onOpenChange={setShowStatusLookup}
      />
    </>
  );
}
