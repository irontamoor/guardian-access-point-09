
import SystemSettings from "../SystemSettings";
import SignInOptionsSettings from "../SignInOptionsSettings";

interface AdminSystemSettingsProps {
  adminData: { role: string; [key: string]: any };
}

export function AdminSystemSettings({ adminData }: AdminSystemSettingsProps) {
  return (
    <div className="space-y-6">
      <SignInOptionsSettings adminData={adminData} />
      <SystemSettings adminData={adminData} />
    </div>
  );
}
