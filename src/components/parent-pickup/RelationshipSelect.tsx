import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSignInOptions } from '@/hooks/useSignInOptions';

interface RelationshipSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RelationshipSelect({ value, onChange }: RelationshipSelectProps) {
  const { options: relationshipOptions, loading } = useSignInOptions("both", "relationship");

  return (
    <div className="space-y-2">
      <Label htmlFor="relationship">Relationship to Student *</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading options..." : "Select relationship"} />
        </SelectTrigger>
        <SelectContent>
          {relationshipOptions.map((type) => (
            <SelectItem key={type.id} value={type.label}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {relationshipOptions.length === 0 && !loading && (
        <div className="text-xs text-gray-500">No relationship options configured</div>
      )}
    </div>
  );
}