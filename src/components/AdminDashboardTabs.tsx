
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3, Hourglass } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import SystemSettings from './SystemSettings';
import Dashboard from './Dashboard';
import AdminActivityDashboard from './AdminActivityDashboard';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username: string; role: string; email?: string };
}

const AdminOverviewTab = ({
  adminData,
}: {
  adminData: { username: string; role: string; email?: string };
}) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Dashboard adminData={adminData} onBack={() => {}} onLogout={() => {}} />
      </div>
      <div className="space-y-6">
        <AdminActivityDashboard />
      </div>
    </div>
  </div>
);

const AdminDashboardTabs = ({
  onBack,
  onLogout,
  adminData,
}: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<{
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    id?: string;
  } | null>(null);

  useEffect(() => {
    const fetchAuthAndProfile = async () => {
      // Get current authenticated user
      const { data: userResult, error: userError } = await supabase.auth.getUser();
      if (userError || !userResult?.user) return;

      const userId = userResult.user.id;
      const userEmail = userResult.user.email || null;
      setCurrentUserEmail(userEmail);

      // Fetch roles from both user_role_assignments and user_roles
      const [{ data: assignments }, { data: appRoles }] = await Promise.all([
        supabase.from("user_role_assignments").select("role").eq("user_id", userId),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);

      // Merge and deduplicate roles
      const rolesArray = [
        ...(assignments || []).map((r) => r.role),
        ...(appRoles || []).map((r) => r.role),
      ];
      const dedupedRoles = Array.from(new Set(rolesArray));
      setUserRoles(dedupedRoles);

      // Fetch profile/user details (from system_users)
      // Using user email to match system_users
      if (userEmail) {
        const { data: userDetails } = await supabase
          .from("system_users")
          .select("first_name, last_name, email, role, id")
          .eq("email", userEmail)
          .maybeSingle();
        setCurrentUserDetails(userDetails || null);
      }
    };
    fetchAuthAndProfile();
  }, []);

  // Only allow access if user explicitly has role "admin" or "reader" per DB (no email hardcoding)
  const isAdminOrReader =
    userRoles.includes("admin") || userRoles.includes("reader");

  // User info bar (top right)
  const UserInfo = () => {
    if (!currentUserDetails && !currentUserEmail) return null;
    return (
      <div className="absolute top-2 right-4 z-20 flex items-center gap-5 bg-white/70 rounded-md px-4 py-2 shadow border border-blue-100">
        <div>
          <div className="font-medium text-gray-900">
            {currentUserDetails
              ? `${currentUserDetails.first_name || ""} ${currentUserDetails.last_name || ""}`.trim() ||
                currentUserDetails.email
              : currentUserEmail}
          </div>
          <div className="text-xs text-gray-600">
            {currentUserDetails?.email || currentUserEmail}
          </div>
        </div>
        <div>
          <div className="text-xs text-blue-600 font-semibold flex flex-wrap gap-x-2">
            {userRoles.length
              ? userRoles.map((r) => (
                  <span
                    key={r}
                    className="inline-block bg-blue-50 border border-blue-200 rounded px-2 py-0.5 mr-1"
                  >
                    {r}
                  </span>
                ))
              : <span className="text-gray-400">No roles assigned</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      <UserInfo />
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
              <AdminOverviewTab adminData={{ ...adminData, ...currentUserDetails }} />
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
