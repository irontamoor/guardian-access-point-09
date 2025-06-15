
import { StaffSignInCard } from './staff-signin/StaffSignInCard';

interface StaffSignInFormProps {
  onSuccess?: () => void;
}

const StaffSignInForm = ({ onSuccess }: StaffSignInFormProps) => {
  return <StaffSignInCard onSuccess={onSuccess} />;
};

export default StaffSignInForm;
