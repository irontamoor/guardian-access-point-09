
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardVisibility = () => {
  const [visibility, setVisibility] = useState({
    showStudentCheckIn: true,
    showStaffSignIn: true,
    showVisitorRegistration: true,
    showParentPickup: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisibilitySettings = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'dashboard_visibility')
          .single();

        if (error) throw error;

        if (data && data.setting_value) {
          setVisibility(data.setting_value as any);
        }
      } catch (error) {
        console.error('Error fetching dashboard visibility:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisibilitySettings();
  }, []);

  return { visibility, loading };
};
