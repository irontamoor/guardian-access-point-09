import { useEffect } from 'react';

const SESSION_KEY = 'admin_session';
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export const useSessionRefresh = (isAuthenticated: boolean) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshSession = () => {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          // Update login time to extend session
          session.loginTime = new Date().toISOString();
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    };

    // Refresh session on user activity
    const handleActivity = () => {
      refreshSession();
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);
};
