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
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="studentName">Student ID *</Label>
        <Input id="studentName" placeholder="Enter Student ID" value={studentName} onChange={e => onStudentNameChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parentName">Name of Person Picking/Dropping *</Label>
        <Input id="parentName" placeholder="Name of Person Picking/Dropping" value={parentName} onChange={e => onParentNameChange(e.target.value)} />
      </div>
    </div>;
}