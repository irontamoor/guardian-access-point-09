
import { Card } from '@/components/ui/card';
import { ParentPickupHeader } from './ParentPickupHeader';
import { PickupForm } from './PickupForm';

interface ParentPickupCardProps {
  onBack?: () => void;
}

export function ParentPickupCard({ onBack }: ParentPickupCardProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <ParentPickupHeader onBack={handleBack} />
      <PickupForm onBack={handleBack} />
    </Card>
  );
}
