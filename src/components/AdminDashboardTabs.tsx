
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3, Hourglass } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import Dashboard from './Dashboard';
import AdminActivityDashboard from './AdminActivityDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { DashboardActivity } from './dashboard/DashboardActivity';
// Removed import { DashboardSecurityAlerts } from './dashboard/DashboardSecurityAlerts';
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
                {/* REMOVED: <DashboardSecurityAlerts /> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- LiveActivityDashboard (no placeholders, only real data) ---
const LiveActivityDashboard = () => {
  const { students, staff } = useVMSData();

  // Calculate present students and present staff
  const presentStudents = students.filter(s => s.status === "present");
  const presentStaff = staff.filter(s => s.status === "present");

  // Simulated queue: reusing 'student' marked as present, treat as "pickup queue"
  // In a real app, queue logic would be more complex
  const pickupQueue = presentStudents.map(stu => ({
    id: stu.id,
    name: stu.name,
    grade: stu.grade,
    check_in_time: stu.check_in_time,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      {/* Students Present */}
      <div>
        <div className="font-bold text-lg mb-2">Students Present</div>
        <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
          {presentStudents.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-4">No students currently present.</div>
          ) : (
            <ul className="divide-y">
              {presentStudents.map(stu => (
                <li key={stu.id} className="py-2 flex justify-between">
                  <span>
                    <span className="font-medium">{stu.name}</span>
                    <span className="ml-2 text-xs text-gray-400">ID: {stu.id}</span>
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">
                    Present
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Staff Present */}
      <div>
        <div className="font-bold text-lg mb-2">Staff Present</div>
        <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
          {presentStaff.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-4">No staff currently present.</div>
          ) : (
            <ul className="divide-y">
              {presentStaff.map(staff => (
                <li key={staff.id} className="py-2 flex justify-between">
                  <span>
                    <span className="font-medium">{staff.name}</span>
                    <span className="ml-2 text-xs text-gray-400">ID: {staff.id}</span>
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    Present
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pickup Queue */}
      <div>
        <div className="font-bold text-lg mb-2">Pickup Queue</div>
        <div className="bg-white rounded-lg shadow p-4 min-h-[120px]">
          {pickupQueue.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-4">No students in pickup queue.</div>
          ) : (
            <ul className="divide-y">
              {pickupQueue.map(student => (
                <li key={student.id} className="py-2 flex justify-between">
                  <span>
                    <span className="font-medium">{student.name}</span>
                    <span className="ml-2 text-xs text-gray-400">ID: {student.id}</span>
                  </span>
                  <span className="text-xs text-yellow-600 font-semibold">
                    In Queue
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// ---

import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";

const AdminDashboardTabs = ({
  onBack,
  onLogout,
  adminData,
}: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardViewType, setDashboardViewType] = useState<"admin_activity" | "live_activity" | "security_alerts">("admin_activity");
  const [logoUrl] = useState<string | null>(null); // Logo moved to sidebar/header
  const [companyName] = useState("Jamiaa Al-Hudaa");

  const isAdminOrReader = adminData?.role === "admin" || adminData?.role === "reader";

  // Layout: sidebar + main area horizontally, header fixed at top of main area
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen w-full">
      <div className="flex w-full max-w-full mx-auto min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Dashboard Header */}
          <DashboardHeader onLogout={onLogout} adminData={adminData} />
          <main className="flex-1 w-full px-3 md:px-8 py-8">
            {/* Tabs content render conditionally, main page style container */}
            <div className="w-full max-w-6xl mx-auto">
              {activeTab === "overview" && (
                isAdminOrReader ? (
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
                )
              )}
              {activeTab === "dashboards" && (
                isAdminOrReader ? (
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
                        {/* REMOVED: <option value="security_alerts">Security Alerts</option> */}
                      </select>
                    </div>
                    {dashboardViewType === "admin_activity" && <AdminActivityDashboard />}
                    {dashboardViewType === "live_activity" && <LiveActivityDashboard />}
                    {/* REMOVED: {dashboardViewType === "security_alerts" && <DashboardSecurityAlerts />} */}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-10">
                    You do not have access to view these dashboards.
                  </div>
                )
              )}
              {activeTab === "users" && <UserManagement />}
              {activeTab === "attendance" && <AttendanceManagement />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTabs;

