
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmployeeCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function EmployeeCodeInput({ value, onChange, disabled }: EmployeeCodeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="employeeCode">Employee ID</Label>
      <Input
        id="employeeCode"
        placeholder="Enter employee ID"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
