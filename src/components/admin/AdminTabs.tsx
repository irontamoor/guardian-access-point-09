
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from "./AdminDashboard";
import { AdminUserManagement } from "./AdminUserManagement";
import { AdminAttendanceManagement } from "./AdminAttendanceManagement";
import { AdminSystemSettings } from "./AdminSystemSettings";

interface AdminTabsProps {
  adminData: any;
}

export function AdminTabs({ adminData }: AdminTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <AdminDashboard adminData={adminData} />
      </TabsContent>
      
      <TabsContent value="users">
        <AdminUserManagement adminData={adminData} />
      </TabsContent>
      
      <TabsContent value="attendance">
        <AdminAttendanceManagement adminData={adminData} />
      </TabsContent>
      
      <TabsContent value="settings">
        <AdminSystemSettings adminData={adminData} />
      </TabsContent>
    </Tabs>
  );
}
