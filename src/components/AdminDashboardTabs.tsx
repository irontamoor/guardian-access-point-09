
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { AdminHeader } from './admin/AdminHeader';
import { AdminTabs } from './admin/AdminTabs';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: any;
}

const AdminDashboardTabs = ({ onBack, onLogout, adminData }: AdminDashboardTabsProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminData={adminData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Main</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <AdminTabs adminData={adminData} />
      </div>
    </div>
  );
};

export default AdminDashboardTabs;
