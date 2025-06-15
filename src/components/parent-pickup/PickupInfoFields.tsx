
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PickupInfoFieldsProps {
  parentName: string;
  relationship: string;
  relationshipError: string | null;
  studentName: string;
  studentId: string;
  carRegistration: string;
  onChange: (field: string, value: string) => void;
}

export function PickupInfoFields({
  parentName,
  relationship,
  relationshipError,
  studentName,
  studentId,
  carRegistration,
  onChange,
}: PickupInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="parentName">Parent/Guardian Name *</Label>
        <Input
          id="parentName"
          placeholder="Enter your full name"
          value={parentName}
          onChange={e => onChange('parentName', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="relationship">Relationship to Student *</Label>
        <Input
          id="relationship"
          placeholder="e.g. Mother, Uncle, Family Friend"
          value={relationship}
          onChange={e => onChange('relationship', e.target.value)}
          className={relationshipError ? "border-red-500" : ""}
        />
        {relationshipError && (
          <div className="text-red-600 text-sm mt-1">{relationshipError}</div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            placeholder="Enter student's name"
            value={studentName}
            onChange={e => onChange('studentName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID *</Label>
          <Input
            id="studentId"
            placeholder="Enter student ID"
            value={studentId}
            onChange={e => onChange('studentId', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="carRegistration">Car Registration (optional)</Label>
        <Input
          id="carRegistration"
          placeholder="Enter car registration number"
          value={carRegistration}
          onChange={e => onChange('carRegistration', e.target.value)}
        />
      </div>
    </>
  );
}
