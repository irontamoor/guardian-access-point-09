
import { useState, useEffect } from 'react';
import { query } from '@/integrations/postgres/client';

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
        const result = await query(
          "SELECT setting_value FROM system_settings WHERE setting_key = $1",
          ['dashboard_visibility']
        );

        if (result.rows.length > 0) {
          const settings = result.rows[0].setting_value;
          setVisibility(settings);
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
