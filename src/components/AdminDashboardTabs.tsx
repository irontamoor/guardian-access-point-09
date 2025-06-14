
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3, Hourglass } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import SystemSettings from './SystemSettings';
import Dashboard from './Dashboard';
import AdminActivityDashboard from './AdminActivityDashboard';
import { Card, CardContent } from '@/components/ui/card';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username?: string; admin_id?: string; email?: string; role: string; first_name?: string; last_name?: string };
}

const AdminOverviewTab = ({
  adminData,
  onLogout,
}: {
  adminData: { username?: string; admin_id?: string; role: string; email?: string; first_name?: string; last_name?: string };
  onLogout: () => void;
}) => {
  const username =
    typeof adminData.username === "string" && adminData.username.length > 0
      ? adminData.username
      : (adminData.admin_id || "");
  const fullName =
    (adminData.first_name || adminData.last_name)
      ? `${adminData.first_name || ""} ${adminData.last_name || ""}`.trim()
      : username;

  // Layout adjustment: show dashboard first, then activity, use more space, relax spacing
  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-8 py-6 flex flex-col gap-8">
      {/* Top info (username/role/logout) handled above in the parent */}
      {/* Heading */}
      <div className="mb-2 space-y-1">
        <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">Admin Dashboard</h2>
        <p className="text-gray-600 text-base max-w-2xl animate-fade-in">Key stats for today and live school activity.</p>
      </div>
      {/* Main Side-by-side Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Dashboard */}
        <div className="flex-1 min-w-0">
          <Card className="shadow border border-blue-100 bg-white/90 animate-fade-in transition-all">
            <CardContent className="p-0">
              <Dashboard
                adminData={{
                  username,
                  role: adminData.role,
                }}
                onBack={() => {}} // removed back button, left blank for now
                onLogout={onLogout}
              />
            </CardContent>
          </Card>
        </div>
        {/* Live Activity */}
        <div className="w-full md:w-[420px] flex-shrink-0">
          <Card className="shadow border border-blue-100 bg-white/90 flex flex-col animate-fade-in transition-all">
            <CardContent className="p-6">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-indigo-700 mb-1">
                  Live Activity
                </h3>
                <p className="text-gray-500 text-xs">
                  Who’s currently present and real-time updates.
                </p>
              </div>
              <AdminActivityDashboard />
            </CardContent>
          </Card>
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
  const isAdminOrReader = adminData?.role === "admin" || adminData?.role === "reader";
  const fullName =
    adminData.first_name || adminData.last_name
      ? `${adminData.first_name || ""} ${adminData.last_name || ""}`.trim()
      : adminData.username || adminData.admin_id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* TopBar: Name, Role, and Logout */}
      <div className="bg-white/90 border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end items-center min-h-[56px]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-semibold text-gray-900 text-base truncate">{fullName || "—"}</span>
              <span className="text-xs text-blue-600 font-medium">{adminData.role}</span>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

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
              <AdminOverviewTab adminData={adminData} onLogout={onLogout} />
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
