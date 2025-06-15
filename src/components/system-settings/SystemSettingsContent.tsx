
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardVisibility {
  showStudentCheckIn: boolean;
  showStaffSignIn: boolean;
  showVisitorRegistration: boolean;
  showParentPickup: boolean;
}

export function SystemSettingsContent() {
  const [visibility, setVisibility] = useState<DashboardVisibility>({
    showStudentCheckIn: true,
    showStaffSignIn: true,
    showVisitorRegistration: true,
    showParentPickup: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisibilitySettings();
  }, []);

  const fetchVisibilitySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'dashboard_visibility');

      if (error) throw error;

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
    }
  };

  const updateVisibilitySetting = async (key: keyof DashboardVisibility, value: boolean) => {
    setLoading(true);
    try {
      const newVisibility = { ...visibility, [key]: value };
      setVisibility(newVisibility);

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'dashboard_visibility',
          setting_value: newVisibility,
          description: 'Controls visibility of dashboard cards'
        });

      if (error) throw error;

      toast({
        title: "Setting Updated",
        description: "Dashboard visibility setting has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="student-checkin">Student Check-In</Label>
            <Switch
              id="student-checkin"
              checked={visibility.showStudentCheckIn}
              onCheckedChange={(checked) => updateVisibilitySetting('showStudentCheckIn', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="staff-signin">Staff Sign-In</Label>
            <Switch
              id="staff-signin"
              checked={visibility.showStaffSignIn}
              onCheckedChange={(checked) => updateVisibilitySetting('showStaffSignIn', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="visitor-registration">Visitor Registration</Label>
            <Switch
              id="visitor-registration"
              checked={visibility.showVisitorRegistration}
              onCheckedChange={(checked) => updateVisibilitySetting('showVisitorRegistration', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="parent-pickup">Parent Pickup</Label>
            <Switch
              id="parent-pickup"
              checked={visibility.showParentPickup}
              onCheckedChange={(checked) => updateVisibilitySetting('showParentPickup', checked)}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
