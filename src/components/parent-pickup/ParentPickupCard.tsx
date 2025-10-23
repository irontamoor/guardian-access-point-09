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
        
        {/* Pickup Status - Moved to Top */}
        <div className="p-4 sm:p-6 border-b">
          <div 
            onClick={() => setShowStatusLookup(true)}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border-2 border-blue-200 p-4 sm:p-6 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <span className="text-lg sm:text-xl text-white">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">Pickup Status</h3>
                <p className="text-xs sm:text-sm text-gray-600">View live pickup approval status</p>
              </div>
            </div>
          </div>
        </div>

        <PickupForm onBack={handleBack} />
      </Card>

      <PickupStatusLookup 
        open={showStatusLookup} 
        onOpenChange={setShowStatusLookup}
      />
    </>
  );
}
