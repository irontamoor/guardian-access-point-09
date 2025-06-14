
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3, Hourglass } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import SystemSettings from './SystemSettings';
import Dashboard from './Dashboard';
import AdminActivityDashboard from './AdminActivityDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { DashboardActivity } from './dashboard/DashboardActivity';
import { DashboardSecurityAlerts } from './dashboard/DashboardSecurityAlerts';
import { DashboardLiveStatusBoard } from './dashboard/DashboardLiveStatusBoard';
import { useVMSData } from '@/hooks/useVMSData';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username?: string; admin_id?: string; email?: string; role: string; first_name?: string; last_name?: string };
}

const UnifiedAdminDashboard = ({
  adminData,
  onLogout,
}: {
  adminData: { username?: string; admin_id?: string; role: string; email?: string; first_name?: string; last_name?: string };
  onLogout: () => void;
}) => {
  // Get all dashboard data using the same hook as Dashboard component
  const { students, staff, recentActivity } = useVMSData();

  const presentStudents = students.filter((s) => s.status === "present").length;
  const presentStaff = staff.filter((s) => s.status === "present").length;

  // Determine name (show admin's name or ID)
  const username =
    typeof adminData.username === "string" && adminData.username.length > 0
      ? adminData.username
      : (adminData.admin_id || "");
  const fullName =
    (adminData.first_name || adminData.last_name)
      ? `${adminData.first_name || ""} ${adminData.last_name || ""}`.trim()
      : username;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-8 py-10">
      {/* Top Bar: only right side (username + role + logout) */}
      <div className="flex flex-row justify-end items-center gap-4 mb-8">
        <div className="flex flex-col items-end text-right">
          <span className="font-semibold text-base text-gray-900">{fullName || "—"}</span>
          <span className="text-xs text-blue-600 font-medium">{adminData.role}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
      {/* Main Dashboard Card */}
      <Card className="shadow-md border border-slate-100 bg-white/95 animate-fade-in transition-all">
        <CardContent className="p-8 space-y-8">
          {/* Heading and description */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h2>
              <p className="text-base text-gray-600">View today's key stats and live activity.</p>
            </div>
            {/* Optionally, date or export/report actions could go here */}
          </div>
          {/* Unified Grid: Metrics, Activity, Security, Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Grid: Key Stats, Recent Activity, Security */}
            <div className="flex flex-col gap-6">
              <section>
                <DashboardMetrics
                  presentStudents={presentStudents}
                  totalStudents={students.length}
                  presentStaff={presentStaff}
                  totalStaff={staff.length}
                />
              </section>
              <section>
                <DashboardActivity recentActivity={recentActivity} />
              </section>
              <section>
                <DashboardSecurityAlerts />
              </section>
            </div>
            {/* Right Grid: Live Activity/Status */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-1">Live Activity</h3>
                <p className="text-gray-500 text-xs mb-3">
                  Who’s currently present and real-time updates.
                </p>
                <AdminActivityDashboard />
              </div>
              <div>
                <DashboardLiveStatusBoard staff={staff} students={students} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
              <UnifiedAdminDashboard adminData={adminData} onLogout={onLogout} />
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
