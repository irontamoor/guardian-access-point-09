
import SystemSettings from "../SystemSettings";
import SignInOptionsSettings from "../SignInOptionsSettings";

export function AdminSystemSettings() {
  return (
    <div className="space-y-6">
      <SignInOptionsSettings />
      <SystemSettings />
    </div>
  );
}
