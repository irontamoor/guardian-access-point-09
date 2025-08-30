import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PickupInfoFieldsEnhancedProps {
  studentId: string;
  onStudentIdChange: (value: string) => void;
  studentName: string;
  onStudentNameChange: (value: string) => void;
  parentGuardianName: string;
  onParentGuardianNameChange: (value: string) => void;
  loading: boolean;
  errors?: { [key: string]: { message: string; hasError: boolean } };
  onBlur?: (field: string) => void;
}

export function PickupInfoFieldsEnhanced({
  studentId,
  onStudentIdChange,
  studentName,
  onStudentNameChange,
  parentGuardianName,
  onParentGuardianNameChange,
  loading,
  errors = {},
  onBlur
}: PickupInfoFieldsEnhancedProps) {
  const getFieldError = (fieldName: string) => errors[fieldName] || { message: '', hasError: false };

  return (
    <>
      {/* Student ID and Parent/Guardian Name on same row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId" className={cn(getFieldError('studentId').hasError && "text-destructive")}>
            Student ID *
          </Label>
          <div className="relative">
            <Input
              id="studentId"
              placeholder="Enter student ID"
              value={studentId}
              onChange={(e) => onStudentIdChange(e.target.value)}
              onBlur={() => onBlur?.('studentId')}
              className={cn(
                getFieldError('studentId').hasError && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            {getFieldError('studentId').hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {getFieldError('studentId').hasError && (
            <p className="text-sm text-destructive">{getFieldError('studentId').message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentGuardianName" className={cn(getFieldError('parentGuardianName').hasError && "text-destructive")}>
            Parent/Guardian Name *
          </Label>
          <div className="relative">
            <Input
              id="parentGuardianName"
              placeholder="Enter parent/guardian name"
              value={parentGuardianName}
              onChange={(e) => onParentGuardianNameChange(e.target.value)}
              onBlur={() => onBlur?.('parentGuardianName')}
              className={cn(
                getFieldError('parentGuardianName').hasError && "border-destructive focus-visible:ring-destructive"
              )}
              disabled={loading}
            />
            {getFieldError('parentGuardianName').hasError && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
            )}
          </div>
          {getFieldError('parentGuardianName').hasError && (
            <p className="text-sm text-destructive">{getFieldError('parentGuardianName').message}</p>
          )}
        </div>
      </div>

      {/* Student Name on its own row */}
      <div className="space-y-2">
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          placeholder="Enter student name (optional)"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
          disabled={loading}
        />
      </div>
    </>
  );
}