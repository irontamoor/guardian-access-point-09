
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemSettingsHeader } from './system-settings/SystemSettingsHeader';
import { SystemSettingsContent } from './system-settings/SystemSettingsContent';
import SignInOptionsSettings from './SignInOptionsSettings';
import type { Database } from '@/integrations/supabase/types';

type SystemSetting = Database['public']['Tables']['system_settings']['Row'];

const SystemSettings = ({ adminData }: { adminData: { role: string; [key: string]: any } }) => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const { toast } = useToast();

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      setSettings(data || []);
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
