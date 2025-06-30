
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StaffNotesInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  quickReasons: Array<{ id: string; label: string }>;
}

export function StaffNotesInput({ value, onChange, disabled, quickReasons }: StaffNotesInputProps) {
  const handleQuickReason = (reasonLabel: string) => {
    if (value.trim()) {
      onChange(value + ', ' + reasonLabel);
    } else {
      onChange(reasonLabel);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Reason / Comment</Label>
      <Textarea
        id="notes"
        placeholder="E.g. Meeting, Offsite, Sick Leave"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-none"
        disabled={disabled}
      />
      {quickReasons && quickReasons.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-gray-600">Quick reasons:</div>
          <div className="flex flex-wrap gap-2">
            {quickReasons.map((reason) => (
              <button
                key={reason.id}
                type="button"
                className="text-xs px-2 py-1 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-green-700 transition-colors"
                onClick={() => handleQuickReason(reason.label)}
                disabled={disabled}
              >
                {reason.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
