
import StudentSignInHeader from './StudentSignInHeader';
import StudentSignInForm from './StudentSignInForm';

interface StudentSignInProps {
  onBack: () => void;
}

const StudentSignIn = ({ onBack }: StudentSignInProps) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
    <StudentSignInHeader onBack={onBack} />
    <div className="max-w-md mx-auto">
      <StudentSignInForm />
    </div>
  </div>
);

export default StudentSignIn;
