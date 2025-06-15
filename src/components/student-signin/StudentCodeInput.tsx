
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StudentCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function StudentCodeInput({ value, onChange, disabled }: StudentCodeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="studentCode">Student ID</Label>
      <Input
        id="studentCode"
        placeholder="Enter student ID"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        disabled={disabled}
      />
    </div>
  );
}
