
import { AdminDashboardLayout } from './admin/AdminDashboardLayout';
import { AdminTabs } from './admin/AdminTabs';

interface AdminDashboardTabsProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: any;
}

const AdminDashboardTabs = ({ onBack, onLogout, adminData }: AdminDashboardTabsProps) => {
  return (
    <AdminDashboardLayout 
      onBack={onBack} 
      onLogout={onLogout} 
      adminData={adminData}
    >
      <AdminTabs adminData={adminData} />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardTabs;
