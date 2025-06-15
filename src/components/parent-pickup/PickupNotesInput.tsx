
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PickupNotesInputProps {
  value: string;
  required: boolean;
  error: string | null;
  onChange: (val: string) => void;
}

export function PickupNotesInput({ value, required, error, onChange }: PickupNotesInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">
        Additional Notes
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <Input
        id="notes"
        placeholder={required ? "Describe details for 'Other' pickup type" : "Any special instructions or notes"}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={required && error ? "border-red-500" : ""}
      />
      {error && (
        <div className="text-red-600 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}
