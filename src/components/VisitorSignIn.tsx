
import { VisitorSignInCard } from './visitor/VisitorSignInCard';

interface VisitorSignInProps {
  onBack: () => void;
}

const VisitorSignIn = ({ onBack }: VisitorSignInProps) => {
  return <VisitorSignInCard onBack={onBack} />;
};

export default VisitorSignIn;
