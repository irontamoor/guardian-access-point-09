
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'dashboard_visibility');

      if (error) {
        console.error('Error fetching visibility settings:', error);
        setError('Failed to load dashboard settings');
        return;
      }

      if (data && data.length > 0) {
        const settingValue = data[0].setting_value;
        // Type guard to ensure we have the correct structure
        if (settingValue && typeof settingValue === 'object' && !Array.isArray(settingValue)) {
          const settings = settingValue as unknown as DashboardVisibility;
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
