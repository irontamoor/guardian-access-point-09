
import { useState } from 'react';
import { useDashboardVisibility } from '@/hooks/useDashboardVisibility';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeWelcome } from '@/components/home/HomeWelcome';
import { HomeActionCards } from '@/components/home/HomeActionCards';
import { HomeAdminAccess } from '@/components/home/HomeAdminAccess';
import StudentSignIn from '@/components/StudentSignIn';
import StaffSignIn from '@/components/StaffSignIn';
import VisitorSignIn from '@/components/VisitorSignIn';
import ParentPickup from '@/components/ParentPickup';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboardTabs from '@/components/AdminDashboardTabs';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { visibility, loading: visibilityLoading } = useDashboardVisibility();
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Update time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  const handleAuthSuccess = (adminData: any) => {
    setAdminUser(adminData);
    setActiveView('admin');
  };

  const handleLogout = () => {
    setAdminUser(null);
    setActiveView('dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'students':
        return <StudentSignIn onBack={() => setActiveView('dashboard')} />;
      case 'staff':
        return <StaffSignIn onBack={() => setActiveView('dashboard')} />;
      case 'visitors':
        return <VisitorSignIn onBack={() => setActiveView('dashboard')} />;
      case 'parents':
        return <ParentPickup onBack={() => setActiveView('dashboard')} />;
      case 'admin':
        if (!adminUser) {
          return <AdminLogin onLogin={handleAuthSuccess} />;
        }
        return (
          <AdminDashboardTabs
            onBack={() => setActiveView('dashboard')}
            onLogout={handleLogout}
            adminData={{ ...adminUser }}
          />
        );
      case 'admin-login':
        return <AdminLogin onLogin={handleAuthSuccess} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <HomeHeader currentTime={currentTime} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <HomeWelcome />
              <HomeActionCards 
                visibility={visibility}
                visibilityLoading={visibilityLoading}
                onViewChange={setActiveView}
              />
              <HomeAdminAccess onViewChange={setActiveView} />
            </div>
          </div>
        );
    }
  };

  return renderView();
};

export default Index;
