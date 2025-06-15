
import { Card } from '@/components/ui/card';
import { StaffSignInHeader } from './StaffSignInHeader';
import { StaffSignInForm } from './StaffSignInForm';

interface StaffSignInCardProps {
  onSuccess?: () => void;
}

export function StaffSignInCard({ onSuccess }: StaffSignInCardProps) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <StaffSignInHeader />
      <StaffSignInForm onSuccess={onSuccess} />
    </Card>
  );
}
