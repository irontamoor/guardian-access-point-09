
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import StaffSignIn from './components/StaffSignIn';
import StudentSignIn from './components/StudentSignIn';
import VisitorSignIn from './components/VisitorSignIn';
import AttendanceRecordsTable from './components/AttendanceRecordsTable';
import AttendanceManagement from './components/AttendanceManagement';
import ParentPickup from './components/ParentPickup';
import ReaderDashboard from './components/ReaderDashboard';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('staff-signin')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Staff Sign In
              </button>
              <button
                onClick={() => setCurrentView('student-signin')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Sign In
              </button>
              <button
                onClick={() => setCurrentView('visitor-signin')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Visitor Sign In
              </button>
              <button
                onClick={() => setCurrentView('parent-pickup')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Parent Pickup
              </button>
              {session && (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentView === 'home' && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to the Visitor Management System!
              </h1>
              <p className="text-gray-600">
                Choose an option from the menu above.
              </p>
            </div>
          )}

          {currentView === 'staff-signin' && (
            <StaffSignIn onBack={() => setCurrentView('home')} />
          )}

          {currentView === 'student-signin' && (
            <StudentSignIn onBack={() => setCurrentView('home')} />
          )}

          {currentView === 'visitor-signin' && (
            <VisitorSignIn onBack={() => setCurrentView('home')} />
          )}

          {currentView === 'attendance-records' && (
            <AttendanceRecordsTable />
          )}

          {currentView === 'attendance-management' && (
            <AttendanceManagement />
          )}

          {currentView === 'parent-pickup' && (
            <ParentPickup onBack={() => setCurrentView('home')} />
          )}
          
          {currentView === 'reader-dashboard' && (
            <ReaderDashboard />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
