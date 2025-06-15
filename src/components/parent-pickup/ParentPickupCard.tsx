
import { Card } from '@/components/ui/card';
import { ParentPickupHeader } from './ParentPickupHeader';
import { PickupForm } from './PickupForm';

interface ParentPickupCardProps {
  onSuccess?: () => void;
}

export function ParentPickupCard({ onSuccess }: ParentPickupCardProps) {
  return (
    <Card className="border-l-4 border-l-orange-500">
      <ParentPickupHeader />
      <PickupForm onSuccess={onSuccess} />
    </Card>
  );
}
