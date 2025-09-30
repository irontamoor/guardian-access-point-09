
import { useVMSData } from "@/hooks/useVMSData";
import { AdminMetrics } from "./AdminMetrics";
import { DashboardCheckInActivity } from "../dashboard/DashboardCheckInActivity";
import { DashboardCheckOutActivity } from "../dashboard/DashboardCheckOutActivity";
import { DashboardLiveStatusBoard } from "../dashboard/DashboardLiveStatusBoard";

interface AdminDashboardProps {
  adminData: any;
}

export function AdminDashboard({ adminData }: AdminDashboardProps) {
  const { students, staff, recentActivity, loading, error } = useVMSData();

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <AdminMetrics students={students} staff={staff} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCheckInActivity recentActivity={recentActivity} />
        <DashboardCheckOutActivity recentActivity={recentActivity} />
      </div>
      
      <DashboardLiveStatusBoard students={students} staff={staff} />
    </div>
  );
}
