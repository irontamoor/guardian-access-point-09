
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  error?: string;
  onBlur?: () => void;
}

export function EmployeeCodeInput({ value, onChange, disabled, error, onBlur }: EmployeeCodeInputProps) {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <Label htmlFor="employeeCode" className={cn(hasError && "text-destructive")}>
        Employee ID *
      </Label>
      <div className="relative">
        <Input
          id="employeeCode"
          placeholder="Enter employee ID"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "w-full",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={disabled}
        />
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
