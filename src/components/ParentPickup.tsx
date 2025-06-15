
import { ParentPickupCard } from './parent-pickup/ParentPickupCard';

interface ParentPickupProps {
  onBack: () => void;
}

const ParentPickup = ({ onBack }: ParentPickupProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ParentPickupCard onBack={onBack} />
      </div>
    </div>
  );
};

export default ParentPickup;
