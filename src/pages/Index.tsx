
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserPlus, Car, Clock, Shield, BookOpen } from 'lucide-react';
import { useDashboardVisibility } from '@/hooks/useDashboardVisibility';
import StudentSignIn from '@/components/StudentSignIn';
import StaffSignIn from '@/components/StaffSignIn';
import VisitorSignIn from '@/components/VisitorSignIn';
import ParentPickup from '@/components/ParentPickup';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboardTabs from '@/components/AdminDashboardTabs';
import type { User } from '@supabase/supabase-js';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { visibility, loading: visibilityLoading } = useDashboardVisibility();

  // Store admin session in local state only
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Update time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  // Handle login with adminData (from AdminLogin, system_users lookup)
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
          return (
            <AdminLogin onLogin={handleAuthSuccess} />
          );
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
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">School VMS</h1>
                      <p className="text-sm text-gray-500">Visitor Management System</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
                      <Clock className="h-5 w-5" />
                      <span>{currentTime.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our School</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Safe, secure, and efficient visitor management for students, staff, visitors, and parents
                </p>
              </div>

              {/* Main Action Cards - Centered grid */}
              <div className="flex justify-center mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                  {!visibilityLoading && visibility.showStudentCheckIn && (
                    <Card 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-blue-500"
                      onClick={() => setActiveView('students')}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Students</span>
                        </div>
                        <CardTitle className="text-xl text-gray-900">Student Check-In</CardTitle>
                        <CardDescription>Quick and easy student arrival and departure tracking</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Sign In / Out
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {!visibilityLoading && visibility.showStaffSignIn && (
                    <Card 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-green-500"
                      onClick={() => setActiveView('staff')}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <UserCheck className="h-8 w-8 text-green-600" />
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Staff</span>
                        </div>
                        <CardTitle className="text-xl text-gray-900">Staff Sign-In</CardTitle>
                        <CardDescription>Employee attendance and time tracking system</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Sign In / Out
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {!visibilityLoading && visibility.showVisitorRegistration && (
                    <Card 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-purple-500"
                      onClick={() => setActiveView('visitors')}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <UserPlus className="h-8 w-8 text-purple-600" />
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Visitors</span>
                        </div>
                        <CardTitle className="text-xl text-gray-900">Visitor Registration</CardTitle>
                        <CardDescription>Secure visitor check-in with badge printing</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Register Visitor
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {!visibilityLoading && visibility.showParentPickup && (
                    <Card 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-orange-500"
                      onClick={() => setActiveView('parents')}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Car className="h-8 w-8 text-orange-600" />
                          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Parents</span>
                        </div>
                        <CardTitle className="text-xl text-gray-900">Parent Pickup</CardTitle>
                        <CardDescription>Safe child pickup and drop-off management</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Pickup / Drop-off
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Admin Access */}
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('admin-login')}
                  className="inline-flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Access user management, attendance editing, and system settings
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderView();
};

export default Index;
