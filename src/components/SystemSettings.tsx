
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SignInOptionsSettings from './SignInOptionsSettings';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  updated_at: string;
}

const SystemSettings = () => {
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
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
      </div>
      <SignInOptionsSettings />
      <Card>
        <CardHeader>
          <CardTitle>No system settings configured yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Once settings are added, they'll appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
