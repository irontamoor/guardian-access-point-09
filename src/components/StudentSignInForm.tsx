
import { StudentSignInCard } from './student-signin/StudentSignInCard';

interface StudentSignInFormProps {
  onSuccess?: () => void;
}

const StudentSignInForm = ({ onSuccess }: StudentSignInFormProps) => {
  return <StudentSignInCard onSuccess={onSuccess} />;
};

export default StudentSignInForm;
