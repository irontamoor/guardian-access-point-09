
import { Settings } from 'lucide-react';

export function SystemSettingsHeader() {
  return (
    <div className="flex items-center space-x-3">
      <Settings className="h-6 w-6 text-purple-600" />
      <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
    </div>
  );
}
