
import { ParentPickupHeader } from './parent-pickup/ParentPickupHeader';
import { PickupForm } from './parent-pickup/PickupForm';

interface ParentPickupProps {
  onBack: () => void;
}

const ParentPickup = ({ onBack }: ParentPickupProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="max-w-6xl mx-auto mb-6">
        <ParentPickupHeader onBack={onBack} />
      </div>
      <div className="max-w-2xl mx-auto">
        <PickupForm onBack={onBack} />
      </div>
    </div>
  );
};

export default ParentPickup;
