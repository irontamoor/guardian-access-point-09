
import { useState } from "react";
import { useSignInOptions } from "@/hooks/useSignInOptions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SignInOptionsSettings() {
  const { options, loading, addOption, deactivateOption, fetchOptions } = useSignInOptions("both");
  const [label, setLabel] = useState("");
  const [appliesTo, setAppliesTo] = useState("both");
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!label.trim()) return;
    const error = await addOption(label.trim(), appliesTo as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setLabel("");
      toast({ title: "Option Added", variant: "default" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-In Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Add new option (e.g. Late, Excused)" />
          <select className="border rounded px-2 py-1" value={appliesTo} onChange={e => setAppliesTo(e.target.value)}>
            <option value="both">Both</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
          <Button onClick={handleAdd} size="sm" disabled={loading || !label.trim()}>Add</Button>
        </div>
        <div className="pt-2">
          <div className="font-semibold mb-1">Current Options:</div>
          <ul className="divide-y">
            {(options || []).map(opt => (
              <li key={opt.id} className="flex items-center justify-between py-2">
                <span>
                  {opt.label} <span className="text-xs text-gray-400">({opt.applies_to})</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-100"
                  onClick={() => deactivateOption(opt.id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
