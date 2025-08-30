import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelationshipSelectEnhancedProps {
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error?: string;
  onBlur?: () => void;
}

export function RelationshipSelectEnhanced({ 
  value, 
  onChange, 
  loading, 
  error,
  onBlur 
}: RelationshipSelectEnhancedProps) {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      <Label htmlFor="relationship" className={cn(hasError && "text-destructive")}>
        Relationship to Student *
      </Label>
      <div className="relative">
        <Select
          value={value}
          onValueChange={onChange}
          disabled={loading}
        >
          <SelectTrigger className={cn(hasError && "border-destructive focus-visible:ring-destructive")}>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="guardian">Guardian</SelectItem>
            <SelectItem value="grandparent">Grandparent</SelectItem>
            <SelectItem value="sibling">Sibling</SelectItem>
            <SelectItem value="aunt_uncle">Aunt/Uncle</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {hasError && (
          <AlertCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive z-10" />
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}