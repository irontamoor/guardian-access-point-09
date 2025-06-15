
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  quickReasons: Array<{ id: string; label: string }>;
}

export function NotesInput({ value, onChange, disabled, quickReasons }: NotesInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Reason / Comment</Label>
      <Textarea
        id="notes"
        placeholder="E.g. Late, Medical Appointment"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none"
        disabled={disabled}
      />
      <div className="flex flex-wrap gap-2 mt-1">
        {quickReasons.map((reason) => (
          <button
            key={reason.id}
            type="button"
            className="text-xs px-2 py-1 bg-gray-100 rounded border hover:bg-blue-100 text-gray-700"
            onClick={() => onChange(value ? value + ', ' + reason.label : reason.label)}
            disabled={disabled}
          >
            {reason.label}
          </button>
        ))}
      </div>
    </div>
  );
}
