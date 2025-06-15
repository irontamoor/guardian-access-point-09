
import { ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminDashboardHeader } from './AdminDashboardHeader';

interface AdminDashboardLayoutProps {
  children: ReactNode;
  onBack: () => void;
  onLogout: () => void;
  adminData: any;
}

export function AdminDashboardLayout({ 
  children, 
  onBack, 
  onLogout, 
  adminData 
}: AdminDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminData={adminData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdminDashboardHeader onBack={onBack} onLogout={onLogout} />
        {children}
      </div>
    </div>
  );
}
