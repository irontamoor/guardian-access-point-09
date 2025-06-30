
import { useState, useEffect } from 'react';
import { query } from '@/integrations/postgres/client';

interface DashboardVisibility {
  showStudentCheckIn: boolean;
  showStaffSignIn: boolean;
  showVisitorRegistration: boolean;
  showParentPickup: boolean;
}

export function useDashboardVisibility() {
  const [visibility, setVisibility] = useState<DashboardVisibility>({
    showStudentCheckIn: true,
    showStaffSignIn: true,
    showVisitorRegistration: true,
    showParentPickup: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisibilitySettings();
  }, []);

  const fetchVisibilitySettings = async () => {
    try {
      setError(null);
      const result = await query(
        "SELECT setting_key, setting_value FROM system_settings WHERE setting_key = $1",
        ['dashboard_visibility']
      );

      if (result.rows && result.rows.length > 0) {
        const settingValue = result.rows[0].setting_value;
        if (settingValue && typeof settingValue === 'object') {
          const settings = settingValue as DashboardVisibility;
          setVisibility(settings);
        }
      }
    } catch (error: any) {
      console.error('Error fetching visibility settings:', error);
      setError('Failed to load dashboard settings');
    } finally {
      setLoading(false);
    }
  };

  return { visibility, loading, error, refetch: fetchVisibilitySettings };
}
