import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ParentPickupHeader } from './ParentPickupHeader';
import { PickupForm } from './PickupForm';
import { PickupStatusLookup } from './PickupStatusLookup';
import { FingerprintScanButton } from './FingerprintScanButton';
import { FingerprintScanDialog } from './FingerprintScanDialog';
import { FingerprintRegistrationForm } from './FingerprintRegistrationForm';
import { StudentSelectionDialog } from './StudentSelectionDialog';

interface ParentFingerprint {
  id: string;
  parent_guardian_name: string;
  relationship: string;
  fingerprint_template: string;
  is_approved: boolean;
}

interface ParentPickupCardProps {
  onBack?: () => void;
}

export function ParentPickupCard({ onBack }: ParentPickupCardProps) {
  const [showStatusLookup, setShowStatusLookup] = useState(false);
  const [showFingerprintScan, setShowFingerprintScan] = useState(false);
  const [showFingerprintRegistration, setShowFingerprintRegistration] = useState(false);
  const [showStudentSelection, setShowStudentSelection] = useState(false);
  const [matchedParent, setMatchedParent] = useState<ParentFingerprint | null>(null);
  const [matchedStudentIds, setMatchedStudentIds] = useState<string[]>([]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleMatchFound = (parentData: ParentFingerprint, studentIds: string[]) => {
    setMatchedParent(parentData);
    setMatchedStudentIds(studentIds);
    setShowStudentSelection(true);
  };

  const handleRegisterNew = () => {
    setShowFingerprintRegistration(true);
  };

  const handleStudentSelectionComplete = () => {
    setMatchedParent(null);
    setMatchedStudentIds([]);
  };

  return (
    <>
      <Card className="border-l-4 border-l-orange-500">
        <ParentPickupHeader onBack={handleBack} />
        
        {/* Fingerprint Scan - Primary Action */}
        <div className="p-4 sm:p-6 border-b">
          <FingerprintScanButton onClick={() => setShowFingerprintScan(true)} />
        </div>

        {/* Pickup Status */}
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

      <FingerprintScanDialog
        open={showFingerprintScan}
        onOpenChange={setShowFingerprintScan}
        onMatchFound={handleMatchFound}
        onRegisterNew={handleRegisterNew}
      />

      <FingerprintRegistrationForm
        open={showFingerprintRegistration}
        onOpenChange={setShowFingerprintRegistration}
        onSuccess={() => {}}
      />

      {matchedParent && (
        <StudentSelectionDialog
          open={showStudentSelection}
          onOpenChange={setShowStudentSelection}
          parentName={matchedParent.parent_guardian_name}
          relationship={matchedParent.relationship}
          studentIds={matchedStudentIds}
          onComplete={handleStudentSelectionComplete}
        />
      )}
    </>
  );
}
