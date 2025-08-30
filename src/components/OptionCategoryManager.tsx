
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AppliesTo = "both" | "student" | "staff";
type Category = "sign_in" | "pickup_type" | "visit_type" | "relationship";

interface SignInOption {
  id: string;
  label: string;
  applies_to: string;
  category: string;
  is_active: boolean;
}

interface OptionCategoryManagerProps {
  title: string;
  placeholder?: string;
  category: Category;
  appliesTo?: AppliesTo;
  options: SignInOption[];
  loading: boolean;
  addOption: (label: string, appliesTo: string, category: string) => Promise<any>;
  deactivateOption: (id: string) => Promise<any>;
  defaultAppliesTo?: AppliesTo;
  showAppliesTo?: boolean;
}

export function OptionCategoryManager({
  title,
  placeholder,
  category,
  appliesTo = "both",
  options,
  loading,
  addOption,
  deactivateOption,
  defaultAppliesTo = "both",
  showAppliesTo = true,
}: OptionCategoryManagerProps) {
  const [label, setLabel] = useState("");
  const [applies, setApplies] = useState<AppliesTo>(defaultAppliesTo);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!label.trim()) return;
    const error = await addOption(label.trim(), applies, category);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setLabel("");
      toast({ title: "Option Added", variant: "default" });
    }
  };

  const handleRemove = async (id: string) => {
    const error = await deactivateOption(id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Option Removed", variant: "default" });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <strong>Note:</strong> Changes made here will persist and update the configuration files.
          Built-in options can be deactivated but not completely removed.
          Custom options can be completely removed.
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center gap-2">
        <Input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder={placeholder || `Add new option (${category})`}
          data-testid="option-input"
        />
        {showAppliesTo && (
          <select
            className="border rounded px-2 py-1 bg-white"
            value={applies}
            onChange={e => setApplies(e.target.value as AppliesTo)}
            data-testid="appliesTo-select"
          >
            <option value="both">Both</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        )}
        <Button
          onClick={handleAdd}
          size="sm"
          disabled={loading || !label.trim()}
          data-testid="add-btn"
        >
          Add
        </Button>
      </div>
      <div>
        <div className="font-semibold mb-2">{title}:</div>
        {loading ? (
          <div className="text-gray-500">Loading options...</div>
        ) : options.length === 0 ? (
          <div className="text-gray-500 italic">No options available. Add some above.</div>
        ) : (
          <ul className="divide-y border rounded">
            {options.map(opt => (
              <li key={opt.id} className="flex items-center justify-between py-2 px-3">
                <span>
                  {opt.label}
                  {showAppliesTo && (
                    <span className="text-xs text-gray-400 ml-2">({opt.applies_to})</span>
                  )}
                  {opt.id.startsWith('custom_') && (
                    <span className="text-xs text-blue-500 ml-2">(Custom)</span>
                  )}
                  {!opt.is_active && (
                    <span className="text-xs text-red-500 ml-2">(Inactive)</span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-100"
                  onClick={() => handleRemove(opt.id)}
                  disabled={loading}
                  title={opt.id.startsWith('custom_') ? "Remove custom option" : "Deactivate built-in option"}
                >
                  {opt.id.startsWith('custom_') ? "Remove" : "Deactivate"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
