
import { useState } from "react";
import { useSignInOptions } from "@/hooks/useSignInOptions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignInOptionsSettings() {
  // For main sign in reason options
  const {
    options: signInOptions,
    loading: signInLoading,
    addOption: addSignInOption,
    deactivateOption: deactivateSignInOption,
  } = useSignInOptions("both", "sign_in");

  // For pickup type options
  const {
    options: pickupOptions,
    loading: pickupLoading,
    addOption: addPickupOption,
    deactivateOption: deactivatePickupOption,
  } = useSignInOptions("both", "pickup_type");

  const [signInLabel, setSignInLabel] = useState("");
  const [signInAppliesTo, setSignInAppliesTo] = useState("both");
  const [pickupLabel, setPickupLabel] = useState("");
  const [pickupAppliesTo, setPickupAppliesTo] = useState("both");
  const { toast } = useToast();

  // UI for Sign-in Options tab
  const signInTab = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={signInLabel}
          onChange={e => setSignInLabel(e.target.value)}
          placeholder="Add new option (e.g. Late, Excused)"
        />
        <select
          className="border rounded px-2 py-1"
          value={signInAppliesTo}
          onChange={e => setSignInAppliesTo(e.target.value)}
        >
          <option value="both">Both</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        <Button
          onClick={async () => {
            if (!signInLabel.trim()) return;
            const error = await addSignInOption(
              signInLabel.trim(),
              signInAppliesTo as any,
              "sign_in"
            );
            if (error) {
              toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
              setSignInLabel("");
              toast({ title: "Option Added", variant: "default" });
            }
          }}
          size="sm"
          disabled={signInLoading || !signInLabel.trim()}
        >
          Add
        </Button>
      </div>
      <div className="pt-2">
        <div className="font-semibold mb-1">Current Options:</div>
        <ul className="divide-y">
          {(signInOptions || []).map(opt => (
            <li key={opt.id} className="flex items-center justify-between py-2">
              <span>
                {opt.label}{' '}
                <span className="text-xs text-gray-400">({opt.applies_to})</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-100"
                onClick={() => deactivateSignInOption(opt.id)}
                disabled={signInLoading}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // UI for Pickup Types tab
  const pickupTab = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={pickupLabel}
          onChange={e => setPickupLabel(e.target.value)}
          placeholder="Add pickup type (e.g. Early, Medical, Bus)"
        />
        <select
          className="border rounded px-2 py-1"
          value={pickupAppliesTo}
          onChange={e => setPickupAppliesTo(e.target.value)}
        >
          <option value="both">Both</option>
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>
        <Button
          onClick={async () => {
            if (!pickupLabel.trim()) return;
            const error = await addPickupOption(
              pickupLabel.trim(),
              pickupAppliesTo as any,
              "pickup_type"
            );
            if (error) {
              toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
              setPickupLabel("");
              toast({ title: "Pickup Type Added", variant: "default" });
            }
          }}
          size="sm"
          disabled={pickupLoading || !pickupLabel.trim()}
        >
          Add
        </Button>
      </div>
      <div className="pt-2">
        <div className="font-semibold mb-1">Current Pickup Types:</div>
        <ul className="divide-y">
          {(pickupOptions || []).map(opt => (
            <li key={opt.id} className="flex items-center justify-between py-2">
              <span>
                {opt.label}{' '}
                <span className="text-xs text-gray-400">({opt.applies_to})</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-100"
                onClick={() => deactivatePickupOption(opt.id)}
                disabled={pickupLoading}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Options Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign_in" className="w-full">
          <TabsList>
            <TabsTrigger value="sign_in">Sign-In Options</TabsTrigger>
            <TabsTrigger value="pickup_type">Pickup Types</TabsTrigger>
          </TabsList>
          <TabsContent value="sign_in">{signInTab}</TabsContent>
          <TabsContent value="pickup_type">{pickupTab}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
