import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Auth from './components/Auth';
import Account from './components/Account';
import StaffSignIn from './components/StaffSignIn';
import StudentSignIn from './components/StudentSignIn';
import VisitorSignIn from './components/VisitorSignIn';
import AttendanceRecordsTable from './components/AttendanceRecordsTable';
import AttendanceManagement from './components/AttendanceManagement';
import ParentPickup from './components/ParentPickup';
import ReaderDashboard from './components/ReaderDashboard';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Check if the user is already signed in and redirect to the appropriate page
    if (session) {
      setCurrentView('attendance-management');
    } else {
      setCurrentView('home');
    }
  }, [session]);

  return (
    
      
        
          
            
              Home
            
            
              Staff Sign In
            
            
              Student Sign In
            
            
              Visitor Sign In
            
            
              Parent Pickup
            
            
              Attendance
            
            
              Account
            
            
              Sign Out
            
          
        

        
          {!session ? (
            <Auth />
          ) : (
            
              {currentView === 'home' && (
                
                  
                    Welcome to the Visitor Management System!
                  
                  
                    Choose an option from the menu above.
                  
                
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

              {currentView === 'account' && (
                <Account session={session} />
              )}

              {currentView === 'parent-pickup' && (
                <ParentPickup onBack={() => setCurrentView('home')} />
              )}
              
              {currentView === 'reader-dashboard' && (
                <ReaderDashboard />
              )}
            
          )}
        
      
    
  );
}

export default App;
