
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserCheck, TrendingUp, Calendar, Download, AlertCircle, LogOut } from 'lucide-react';
import { useVMSData } from '@/hooks/useVMSData';
import DashboardHeader from "./dashboard/DashboardHeader"; // Fixed: default import
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { DashboardActivity } from "./dashboard/DashboardActivity";
import { DashboardSecurityAlerts } from "./dashboard/DashboardSecurityAlerts";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <DashboardHeader
        onBack={onBack}
        onLogout={onLogout}
        adminData={adminData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardMetrics
          presentStudents={presentStudents}
          totalStudents={students.length}
          presentStaff={presentStaff}
          totalStaff={staff.length}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardActivity recentActivity={recentActivity} />
          <DashboardSecurityAlerts />
        </div>
        <DashboardLiveStatusBoard staff={staff} students={students} />
      </div>
    </div>
  );
};

export default Dashboard;
