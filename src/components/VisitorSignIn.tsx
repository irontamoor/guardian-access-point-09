
import { VisitorHeader } from './visitor/VisitorHeader';
import { VisitorForm } from './visitor/VisitorForm';

interface VisitorSignInProps {
  onBack: () => void;
}

const VisitorSignIn = ({ onBack }: VisitorSignInProps) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
    <VisitorHeader onBack={onBack} />
    <div className="max-w-md mx-auto">
      <VisitorForm />
    </div>
  </div>
);

export default VisitorSignIn;
