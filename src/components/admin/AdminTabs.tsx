
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "./AdminDashboard";
import { AdminUserManagement } from "./AdminUserManagement";
import { AdminAttendanceManagement } from "./AdminAttendanceManagement";
import { AdminSystemSettings } from "./AdminSystemSettings";

interface AdminTabsProps {
  adminData: any;
}

export function AdminTabs({ adminData }: AdminTabsProps) {
  const role = adminData?.role;
  
  // Define which tabs each role can access
  const canAccessUsers = role === 'admin';
  const canAccessSettings = role === 'admin' || role === 'staff_admin';
  
  // Calculate grid columns based on visible tabs
  const gridColsClass = 
    role === 'admin' ? 'grid-cols-4' : 
    role === 'staff_admin' ? 'grid-cols-3' : 
    'grid-cols-2';
  
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className={`grid w-full ${gridColsClass}`}>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        {canAccessUsers && <TabsTrigger value="users">User Management</TabsTrigger>}
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        {canAccessSettings && <TabsTrigger value="settings">Settings</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="dashboard">
        <AdminDashboard adminData={adminData} />
      </TabsContent>
      
      {canAccessUsers && (
        <TabsContent value="users">
          <AdminUserManagement />
        </TabsContent>
      )}
      
      <TabsContent value="attendance">
        <AdminAttendanceManagement />
      </TabsContent>
      
      {canAccessSettings && (
        <TabsContent value="settings">
          <AdminSystemSettings adminData={adminData} />
        </TabsContent>
      )}
    </Tabs>
  );
}
