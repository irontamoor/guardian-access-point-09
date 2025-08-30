import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSignInOptionsJson } from '@/hooks/useSignInOptionsJson';
interface RelationshipSelectProps {
  value: string;
  onChange: (value: string) => void;
}
export function RelationshipSelect({
  value,
  onChange
}: RelationshipSelectProps) {
  const {
    options: relationshipOptions,
    loading
  } = useSignInOptionsJson("both", "relationship");
  console.log('[RelationshipSelect] Component state:', {
    optionsCount: relationshipOptions.length,
    loading,
    currentValue: value,
    availableOptions: relationshipOptions.map(opt => ({
      id: opt.id,
      label: opt.label,
      applies_to: opt.applies_to
    }))
  });
  return <div className="space-y-2">
      <Label htmlFor="relationship">Relationship to Student *</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading options..." : "Select relationship"} />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-[100]">
          {relationshipOptions.map(type => <SelectItem key={type.id} value={type.label}>
              {type.label}
            </SelectItem>)}
        </SelectContent>
      </Select>
      {relationshipOptions.length === 0 && !loading && <p className="text-sm text-red-600">No relationship options available. Please add them in Admin Settings.</p>}
      {/* Debug info for development */}
      {relationshipOptions.length > 0}
    </div>;
}