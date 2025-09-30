
import { VisitorHeader } from './VisitorHeader';
import { VisitorForm } from './VisitorForm';
import { VisitorCheckOut } from './VisitorCheckOut';

interface VisitorSignInCardProps {
  onBack: () => void;
}

export function VisitorSignInCard({ onBack }: VisitorSignInCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <VisitorHeader onBack={onBack} />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check Out on left / top */}
          <div className="order-1">
            <VisitorCheckOut />
          </div>
          {/* Registration on right / bottom */}
          <div className="order-2">
            <VisitorForm />
          </div>
        </div>
      </div>
    </div>
  );
}
