
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSignInOptions } from '@/hooks/useSignInOptions';

interface PickupTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PickupTypeSelect({ value, onChange }: PickupTypeSelectProps) {
  const { options: pickupTypes, loading } = useSignInOptions("both", "pickup_type");

  return (
    <div className="space-y-2">
      <Label htmlFor="pickupType">Pickup/Drop-off Type</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading options..." : "Select type (optional)"} />
        </SelectTrigger>
        <SelectContent>
          {pickupTypes.map((type) => (
            <SelectItem key={type.id} value={type.label}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pickupTypes.length === 0 && !loading && (
        <div className="text-xs text-gray-500">No pickup types configured</div>
      )}
    </div>
  );
}
