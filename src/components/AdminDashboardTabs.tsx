
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Settings, BarChart3 } from 'lucide-react';
import UserManagement from './UserManagement';
import AttendanceManagement from './AttendanceManagement';
import SystemSettings from './SystemSettings';
import Dashboard from './Dashboard';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username: string; role: string };
}

const AdminDashboardTabs = ({ onBack, onLogout, adminData }: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-14">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
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
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard onBack={onBack} onLogout={onLogout} adminData={adminData} />
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
