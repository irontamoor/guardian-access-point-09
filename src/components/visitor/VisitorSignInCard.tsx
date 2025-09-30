
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
      <div className="max-w-4xl mx-auto space-y-6">
        <VisitorForm />
        <VisitorCheckOut />
      </div>
    </div>
  );
}
