
import { useState, useEffect } from 'react';
import systemSettingsData from '@/config/systemSettings.json';

interface SystemSettings {
  dashboard_visibility: {
    showStudentCheckIn: boolean;
    showStaffSignIn: boolean;
    showVisitorRegistration: boolean;
    showParentPickup: boolean;
  };
  school_name: string;
  max_visitors_per_day: number;
  auto_signout_hours: number;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(systemSettingsData);
  const [loading, setLoading] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // In a real app, you might want to persist this to localStorage or a backend
    localStorage.setItem('systemSettings', JSON.stringify({ ...settings, [key]: value }));
  };

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading system settings from localStorage:', error);
      }
    }
  }, []);

  return {
    settings,
    loading,
    updateSetting,
  };
}
