
import StaffSignInHeader from './StaffSignInHeader';
import StaffSignInForm from './StaffSignInForm';

interface StaffSignInProps {
  onBack: () => void;
}

const StaffSignIn = ({ onBack }: StaffSignInProps) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
    <StaffSignInHeader onBack={onBack} />
    <div className="max-w-md mx-auto">
      <StaffSignInForm />
    </div>
  </div>
);

export default StaffSignIn;
