
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AppliesTo = "both" | "student" | "staff";
type Category = "sign_in" | "pickup_type" | "visit_type";

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
  showAppliesTo?: boolean; // show appliesTo dropdown
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
      <div className="flex items-center gap-2">
        <Input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder={placeholder || `Add new option (${category})`}
          data-testid="option-input"
        />
        {showAppliesTo && (
          <select
            className="border rounded px-2 py-1"
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
        <div className="font-semibold mb-1">{title}:</div>
        <ul className="divide-y">
          {(options || []).map(opt => (
            <li key={opt.id} className="flex items-center justify-between py-2">
              <span>
                {opt.label}
                {showAppliesTo && (
                  <span className="text-xs text-gray-400 ml-2">({opt.applies_to})</span>
                )}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-100"
                onClick={() => handleRemove(opt.id)}
                disabled={loading}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
