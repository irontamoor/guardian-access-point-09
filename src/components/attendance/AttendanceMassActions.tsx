
import { Button } from '@/components/ui/button';

interface AttendanceMassActionsProps {
  selectedCount: number;
  onMassEdit: () => void;
  isLoading: boolean;
}

export function AttendanceMassActions({ selectedCount, onMassEdit, isLoading }: AttendanceMassActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          onClick={onMassEdit}
          className="flex gap-1"
          disabled={isLoading}
        >
          Mass Edit {selectedCount} Record{selectedCount !== 1 && "s"}
        </Button>
        <span className="text-xs text-gray-500">You can update all selected attendance records</span>
      </div>
    </div>
  );
}
