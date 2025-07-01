
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'home' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => setCurrentView('staff-signin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'staff-signin' 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                👥 Staff Sign In
              </button>
              <button
                onClick={() => setCurrentView('student-signin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'student-signin' 
                    ? 'bg-yellow-100 text-yellow-700 shadow-sm' 
                    : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'
                }`}
              >
                🎓 Student Sign In
              </button>
              <button
                onClick={() => setCurrentView('visitor-signin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'visitor-signin' 
                    ? 'bg-purple-100 text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                🆔 Visitor Sign In
              </button>
              <button
                onClick={() => setCurrentView('parent-pickup')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'parent-pickup' 
                    ? 'bg-orange-100 text-orange-700 shadow-sm' 
                    : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50'
                }`}
              >
                🚗 Parent Pickup
              </button>
              {session && (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                >
                  🚪 Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {currentView === 'home' && (
            <div className="text-center space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 mb-8">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">🏫</span>
                    </div>
                    <div className="text-left">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Visitor Management System
                      </h1>
                      <p className="text-lg text-gray-600 mt-2">
                        Safe, secure, and efficient visitor tracking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div 
                    onClick={() => setCurrentView('staff-signin')}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl text-white">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Staff Sign In</h3>
                    <p className="text-gray-600 text-sm">Quick check-in/out for staff members</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('student-signin')}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl text-white">🎓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Sign In</h3>
                    <p className="text-gray-600 text-sm">Student attendance tracking</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('visitor-signin')}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl text-white">🆔</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Visitor Registration</h3>
                    <p className="text-gray-600 text-sm">Register visitors and print badges</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('parent-pickup')}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-100 p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-xl text-white">🚗</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Parent Pickup</h3>
                    <p className="text-gray-600 text-sm">Student pickup and drop-off tracking</p>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-gray-700 text-center">
                    Select an option above to get started with your visitor management tasks
                  </p>
                </div>
              </div>
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
