
import { useState } from 'react';
import systemSettingsData from '@/config/systemSettings.json';

interface SystemSettings {
  dashboard_visibility: {
    showStudentCheckIn: boolean;
    showStaffSignIn: boolean;
    showVisitorRegistration: boolean;
    showParentPickup: boolean;
  };
  photo_capture_settings: {
    requireStudentPhoto: boolean;
    requireStaffPhoto: boolean;
  };
  school_name: string;
  max_visitors_per_day: number;
  auto_signout_hours: number;
}

export function useSystemSettings() {
  // Read directly from JSON file, with session-only modifications
  const [settings, setSettings] = useState<SystemSettings>(systemSettingsData);
  const [loading, setLoading] = useState(false);

  const updateSetting = (key: string, value: any) => {
    console.log('[useSystemSettings] Updating setting (session-only):', { key, value });
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Note: Changes are session-only and not persisted
  };

  return {
    settings,
    loading,
    updateSetting,
  };
}
