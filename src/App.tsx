
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {currentView === 'home' && (
            <div className="space-y-8">
              {/* Main Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl text-white">🏫</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                      Visitor Management System
                    </h1>
                    <p className="text-lg text-slate-600 mt-1">
                      Safe, secure, and efficient visitor tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div 
                  onClick={() => setCurrentView('staff-signin')}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl text-white">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Staff Sign In</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Quick check-in/out for staff members</p>
                </div>

                <div 
                  onClick={() => setCurrentView('student-signin')}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl text-white">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Student Sign In</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Student attendance tracking</p>
                </div>

                <div 
                  onClick={() => setCurrentView('visitor-signin')}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl text-white">🆔</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Visitor Registration</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Register visitors and print badges</p>
                </div>

                <div 
                  onClick={() => setCurrentView('parent-pickup')}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl text-white">🚗</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Parent Pickup</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Student pickup and drop-off tracking</p>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="text-center mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg max-w-2xl mx-auto">
                  <p className="text-slate-700 text-lg">
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
