
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PickupTypeSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  loading?: boolean;
}

export function PickupTypeSelect({ value, onChange, options, loading }: PickupTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="pickupType" className="text-sm font-medium">Pickup Type</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select pickup type" />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
