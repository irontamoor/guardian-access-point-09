import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
          <div 
            onClick={() => setShowStatusLookup(true)}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <span className="text-xl text-white">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Pickup Status</h3>
                <p className="text-sm text-gray-600">View live pickup approval status</p>
              </div>
            </div>
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
