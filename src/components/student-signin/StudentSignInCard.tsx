
import { Card } from '@/components/ui/card';
import { StudentSignInHeader } from './StudentSignInHeader';
import { StudentSignInForm } from './StudentSignInForm';

interface StudentSignInCardProps {
  onSuccess?: () => void;
}

export function StudentSignInCard({ onSuccess }: StudentSignInCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <StudentSignInHeader />
      <StudentSignInForm onSuccess={onSuccess} />
    </Card>
  );
}
