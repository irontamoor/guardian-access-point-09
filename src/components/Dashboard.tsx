
import { useState, useEffect } from 'react';
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
  const { students, staff, recentActivity, loading, loadData } = useVMSData();

  // Force reload data when component mounts
  useEffect(() => {
    console.log('Dashboard mounted, loading data...');
    loadData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadData]);

  const presentStudents = students.filter((s) => s.status === "present").length;
  const presentStaff = staff.filter((s) => s.status === "present").length;

  console.log('Dashboard render:', {
    studentsCount: students.length,
    staffCount: staff.length,
    presentStudents,
    presentStaff,
    recentActivityCount: recentActivity.length,
    loading
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    );
  }

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
