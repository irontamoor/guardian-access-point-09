
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PickupNotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PickupNotesInput({ value, onChange }: PickupNotesInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes</Label>
      <Textarea
        id="notes"
        placeholder="Any special instructions or notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none min-h-24"
        rows={4}
      />
    </div>
  );
}
