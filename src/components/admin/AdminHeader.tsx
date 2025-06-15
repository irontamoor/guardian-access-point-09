
import { Users } from 'lucide-react';

interface AdminHeaderProps {
  adminData: { first_name?: string; last_name?: string; role: string };
}

export function AdminHeader({ adminData }: AdminHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage users, attendance, and system settings</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">
              Welcome, {adminData.first_name} {adminData.last_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
