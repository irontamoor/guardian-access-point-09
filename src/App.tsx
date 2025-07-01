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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-7xl">
          {currentView === 'home' && (
            <div className="space-y-12">
              {/* Main Title Section */}
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl">
                    <span className="text-3xl text-white">🏫</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-5xl font-bold text-gray-800 mb-2">
                      Visitor Management System
                    </h1>
                    <p className="text-xl text-gray-600">
                      Safe, secure, and efficient visitor tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Cards Grid */}
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                  <div 
                    onClick={() => setCurrentView('staff-signin')}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl text-white">👥</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Staff Sign In</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Quick check-in/out for staff members</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('student-signin')}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl text-white">🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Student Sign In</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Student attendance tracking</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('visitor-signin')}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl text-white">🆔</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Visitor Registration</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Register visitors and print badges</p>
                  </div>

                  <div 
                    onClick={() => setCurrentView('parent-pickup')}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-2xl text-white">🚗</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Parent Pickup</h3>
                    <p className="text-gray-600 text-base leading-relaxed">Student pickup and drop-off tracking</p>
                  </div>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="flex justify-center mt-16">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl max-w-3xl">
                  <p className="text-gray-700 text-xl text-center font-medium">
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
