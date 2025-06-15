
import SystemSettings from "../SystemSettings";

interface AdminSystemSettingsProps {
  adminData: { role: string; [key: string]: any };
}

export function AdminSystemSettings({ adminData }: AdminSystemSettingsProps) {
  return (
    <div className="space-y-6">
      <SystemSettings adminData={adminData} />
    </div>
  );
}
