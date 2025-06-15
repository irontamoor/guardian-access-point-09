
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save, School } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  updated_at: string;
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [schoolSettings, setSchoolSettings] = useState({
    school_name: '',
    auto_signout_hours: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      
      const settingsData = data || [];
      setSettings(settingsData);

      // Parse specific settings
      settingsData.forEach((setting: SystemSetting) => {
        switch (setting.setting_key) {
          case 'school_name':
            setSchoolSettings(prev => ({
              ...prev,
              school_name: typeof setting.setting_value === 'string' ? 
                setting.setting_value.replace(/"/g, '') : 
                setting.setting_value
            }));
            break;
          case 'auto_signout_hours':
            setSchoolSettings(prev => ({
              ...prev,
              auto_signout_hours: setting.setting_value?.toString() || ''
            }));
            break;
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch settings",
        variant: "destructive"
      });
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to update ${key}`,
        variant: "destructive"
      });
      return false;
    }
  };

  const handleSaveSchoolSettings = async () => {
    setIsLoading(true);
    const updates = [
      updateSetting('school_name', schoolSettings.school_name),
      updateSetting('auto_signout_hours', parseInt(schoolSettings.auto_signout_hours) || 8)
    ];

    const results = await Promise.all(updates);
    if (results.every(r => r)) {
      toast({
        title: "Success",
        description: "School settings saved successfully",
        variant: "default"
      });
      fetchSettings();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Settings */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <School className="h-5 w-5" />
              <span>School Settings</span>
            </CardTitle>
            <CardDescription>Configure general school and system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                placeholder="School name"
                value={schoolSettings.school_name}
                onChange={(e) => setSchoolSettings(prev => ({ ...prev, school_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auto_signout">Auto Sign-out Hours</Label>
              <Input
                id="auto_signout"
                type="number"
                placeholder="8"
                value={schoolSettings.auto_signout_hours}
                onChange={(e) => setSchoolSettings(prev => ({ ...prev, auto_signout_hours: e.target.value }))}
              />
              <p className="text-sm text-gray-500">
                Automatically sign out users after this many hours
              </p>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveSchoolSettings} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current System Settings</CardTitle>
          <CardDescription>Overview of all system settings and their last update times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-500">{setting.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {typeof setting.setting_value === 'object' 
                      ? 'Object' 
                      : setting.setting_value?.toString() || 'Not set'
                    }
                  </div>
                  <div className="text-xs text-gray-400">
                    Updated: {new Date(setting.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;

