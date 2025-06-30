
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';
import { SystemSettingsHeader } from './system-settings/SystemSettingsHeader';
import { SystemSettingsContent } from './system-settings/SystemSettingsContent';
import SignInOptionsSettings from './SignInOptionsSettings';
import type { SystemSetting } from '@/integrations/postgres/types';

const SystemSettings = ({ adminData }: { adminData: { role: string; [key: string]: any } }) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const result = await query('SELECT * FROM system_settings ORDER BY setting_key');
      setSettings(result.rows || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <SystemSettingsHeader />
      <SystemSettingsContent />
      <SignInOptionsSettings adminData={adminData} />
    </div>
  );
};

export default SystemSettings;
