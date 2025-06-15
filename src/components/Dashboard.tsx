
import { useState } from 'react';
import { useVMSData } from '@/hooks/useVMSData';
import { DashboardLayout } from "./dashboard/DashboardLayout";
import DashboardHeader from "./dashboard/DashboardHeader";
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { DashboardActivity } from "./dashboard/DashboardActivity";
import { DashboardLiveStatusBoard } from "./dashboard/DashboardLiveStatusBoard";

interface DashboardProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username: string; role: string };
}

const Dashboard = ({ onBack, onLogout, adminData }: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { students, staff, recentActivity } = useVMSData();

  const presentStudents = students.filter((s) => s.status === "present").length;
  const presentStaff = staff.filter((s) => s.status === "present").length;

  return (
    <DashboardLayout>
      <DashboardHeader
        onLogout={onLogout}
        adminData={adminData}
      />
      
      <DashboardMetrics
        presentStudents={presentStudents}
        totalStudents={students.length}
        presentStaff={presentStaff}
        totalStaff={staff.length}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardActivity recentActivity={recentActivity} />
      </div>
      
      <DashboardLiveStatusBoard staff={staff} students={students} />
    </DashboardLayout>
  );
};

export default Dashboard;
