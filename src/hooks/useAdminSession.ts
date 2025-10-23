import { useState, useEffect } from 'react';

interface AdminSession {
  id: string;
  admin_id: string;
  email: string;
  role: string;
  first_name: string;
  loginTime: string;
}

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const useAdminSession = () => {
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          
          // Check if session is still valid (not expired)
          const loginTime = new Date(session.loginTime).getTime();
          const now = Date.now();
          
          if (now - loginTime < SESSION_DURATION) {
            setAdminUser(session);
          } else {
            // Session expired, clear it
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading admin session:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    };

    loadSession();
  }, []);

  const saveSession = (adminData: Omit<AdminSession, 'loginTime'>) => {
    const session: AdminSession = {
      ...adminData,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAdminUser(session);
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setAdminUser(null);
  };

  return {
    adminUser,
    saveSession,
    clearSession,
    isAuthenticated: !!adminUser
  };
};
