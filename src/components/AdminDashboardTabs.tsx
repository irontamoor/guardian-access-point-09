import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3, Hourglass } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import SystemSettings from './SystemSettings';
import Dashboard from './Dashboard';
import AdminActivityDashboard from './AdminActivityDashboard';
import UserInfoBox from './UserInfoBox';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username?: string; admin_id?: string; email?: string; role: string; first_name?: string; last_name?: string };
}

const AdminOverviewTab = ({
  adminData,
}: {
  adminData: { username?: string; admin_id?: string; role: string; email?: string; first_name?: string; last_name?: string };
}) => {
  // Ensure required fields for Dashboard: username (string), role (string)
  const username =
    typeof adminData.username === "string" && adminData.username.length > 0
      ? adminData.username
      : (adminData.admin_id || "");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Dashboard
            adminData={{
              username,
              role: adminData.role,
            }}
            onBack={() => {}}
            onLogout={() => {}}
          />
        </div>
        <div className="space-y-6">
          <AdminActivityDashboard />
        </div>
      </div>
    </div>
  );
};

const AdminDashboardTabs = ({
  onBack,
  onLogout,
  adminData,
}: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Use role from adminData prop for access check
  const isAdminOrReader = adminData?.role === "admin" || adminData?.role === "reader";

  const fullName =
    adminData.first_name || adminData.last_name
      ? `${adminData.first_name || ""} ${adminData.last_name || ""}`.trim()
      : adminData.username || adminData.admin_id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      <UserInfoBox
        name={fullName}
        email={adminData.email}
        roles={[adminData.role]}
        isLoading={false}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-6 h-14">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="dashboards" className="flex items-center space-x-2">
                <Hourglass className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboards</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <TabsContent value="overview" className="mt-0">
            {isAdminOrReader ? (
              <AdminOverviewTab adminData={adminData} />
            ) : (
              <div className="text-center text-gray-400 py-10">
                You do not have access to view the overview dashboard.
              </div>
            )}
          </TabsContent>
          <TabsContent value="dashboards" className="mt-0">
            {isAdminOrReader ? (
              <AdminActivityDashboard />
            ) : (
              <div className="text-center text-gray-400 py-10">
                You do not have access to view these dashboards.
              </div>
            )}
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <UserManagement />
          </TabsContent>
          <TabsContent value="attendance" className="mt-0">
            <AttendanceManagement />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SystemSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboardTabs;
