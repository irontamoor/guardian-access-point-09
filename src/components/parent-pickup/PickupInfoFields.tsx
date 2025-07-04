
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PickupInfoFieldsProps {
  studentName: string;
  parentName: string;
  onStudentNameChange: (value: string) => void;
  onParentNameChange: (value: string) => void;
}

export function PickupInfoFields({ 
  studentName, 
  parentName, 
  onStudentNameChange, 
  onParentNameChange 
}: PickupInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="studentName">Student Name *</Label>
        <Input
          id="studentName"
          placeholder="Enter student name"
          value={studentName}
          onChange={(e) => onStudentNameChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
        <Input
          id="parentName"
          placeholder="Enter parent/guardian name"
          value={parentName}
          onChange={(e) => onParentNameChange(e.target.value)}
        />
      </div>
    </div>
  );
}
