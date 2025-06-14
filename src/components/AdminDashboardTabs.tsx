
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

// --- UnifiedAdminDashboard helper component ---
interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: {
    username?: string;
    admin_id?: string;
    email?: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
}

const UnifiedAdminDashboard = ({
  adminData,
  onLogout,
  companyName,
  logoUrl,
}: {
  adminData: { username?: string; admin_id?: string; role: string; email?: string; first_name?: string; last_name?: string };
  onLogout: () => void;
  companyName: string;
  logoUrl: string | null;
}) => {
  const { students, staff, recentActivity } = useVMSData();

  const presentStudents = students.filter((s) => s.status === "present").length;
  const presentStaff = staff.filter((s) => s.status === "present").length;

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
      <Card className="shadow-md border border-slate-100 bg-white/95 animate-fade-in transition-all">
        <CardContent className="p-8 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="h-12 w-12 rounded object-cover border" />
            ) : (
              <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                <BarChart3 className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{companyName || "Admin Dashboard"}</h2>
              <p className="text-base text-gray-500">View today's key stats and live activity.</p>
            </div>
            <div className="text-right hidden md:block">
              <span className="block font-semibold text-base text-gray-900">{fullName || "—"}</span>
              <span className="block text-xs text-blue-600 font-medium">{adminData.role}</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <DashboardMetrics
              presentStudents={presentStudents}
              totalStudents={students.length}
              presentStaff={presentStaff}
              totalStaff={staff.length}
            />
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-6">
                <DashboardActivity recentActivity={recentActivity} />
                <DashboardSecurityAlerts />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- LiveActivityDashboard (for dashboards tab) ---
const LiveActivityDashboard = () => {
  const { students, staff } = useVMSData();
  return (
    <div>
      <h3 className="text-xl font-semibold text-indigo-700 mb-1">Live Activity</h3>
      <p className="text-gray-500 text-xs mb-3">
        Who’s currently present and real-time updates.
      </p>
      <DashboardLiveStatusBoard staff={staff} students={students} />
    </div>
  );
};
// ---

const AdminDashboardTabs = ({
  onBack,
  onLogout,
  adminData,
}: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardViewType, setDashboardViewType] = useState<"admin_activity" | "live_activity" | "security_alerts">("admin_activity");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("My Company");

  // Pass down companyName setter to SystemSettings to sync with school_name
  // Remove the prop for now - SystemSettings does not accept onSchoolNameChange
  //const handleSchoolNameChange = (name: string) => setCompanyName(name);

  const isAdminOrReader = adminData?.role === "admin" || adminData?.role === "reader";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        setLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div>
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="h-10 w-10 rounded object-cover border" />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-xl text-gray-400">
                    <BarChart3 className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-800">{companyName}</span>
                <label htmlFor="logo-upload" className="text-[11px] text-blue-600 cursor-pointer hover:underline">
                  Change Logo
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-6 h-12">
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
            <div className="flex flex-col items-end">
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <TabsContent value="overview" className="mt-0">
            {isAdminOrReader ? (
              <UnifiedAdminDashboard 
                adminData={adminData}
                onLogout={onLogout}
                companyName={companyName}
                logoUrl={logoUrl}
              />
            ) : (
              <div className="text-center text-gray-400 py-10">
                You do not have access to view the overview dashboard.
              </div>
            )}
          </TabsContent>
          <TabsContent value="dashboards" className="mt-0">
            {isAdminOrReader ? (
              <div>
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <label htmlFor="dashboard-view-type" className="text-sm font-medium text-gray-700 mr-2">
                    View:
                  </label>
                  <select
                    id="dashboard-view-type"
                    value={dashboardViewType}
                    onChange={e => setDashboardViewType(e.target.value as any)}
                    className="border border-gray-300 px-3 py-1 rounded text-sm"
                  >
                    <option value="admin_activity">Admin Activity</option>
                    <option value="live_activity">Live Activity</option>
                    <option value="security_alerts">Security Alerts</option>
                  </select>
                </div>
                {dashboardViewType === "admin_activity" && <AdminActivityDashboard />}
                {dashboardViewType === "live_activity" && <LiveActivityDashboard />}
                {dashboardViewType === "security_alerts" && <DashboardSecurityAlerts />}
              </div>
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
