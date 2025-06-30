
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { query } from '@/integrations/postgres/client';

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisibilitySettings();
  }, []);

  const fetchVisibilitySettings = async () => {
    try {
      setError(null);
      const result = await query(
        `SELECT setting_key, setting_value FROM system_settings WHERE setting_key = $1`,
        ['dashboard_visibility']
      );

      if (result.rows && result.rows.length > 0) {
        const settingValue = result.rows[0].setting_value;
        if (settingValue && typeof settingValue === 'object' && !Array.isArray(settingValue)) {
          const settings = settingValue as unknown as DashboardVisibility;
          setVisibility(settings);
        }
      }
    } catch (error: any) {
      console.error('Error fetching visibility settings:', error);
      setError('Failed to load settings. Please check your permissions.');
    }
  };

  const updateVisibilitySetting = async (key: keyof DashboardVisibility, value: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const newVisibility = { ...visibility, [key]: value };
      
      // First check if record exists
      const existingResult = await query(
        `SELECT id FROM system_settings WHERE setting_key = $1`,
        ['dashboard_visibility']
      );

      if (existingResult.rows && existingResult.rows.length > 0) {
        // Update existing record
        await query(
          `UPDATE system_settings SET 
           setting_value = $1, 
           description = $2, 
           updated_at = NOW() 
           WHERE setting_key = $3`,
          [JSON.stringify(newVisibility), 'Controls visibility of dashboard cards', 'dashboard_visibility']
        );
      } else {
        // Insert new record
        await query(
          `INSERT INTO system_settings (setting_key, setting_value, description) 
           VALUES ($1, $2, $3)`,
          ['dashboard_visibility', JSON.stringify(newVisibility), 'Controls visibility of dashboard cards']
        );
      }

      setVisibility(newVisibility);

      toast({
        title: "Setting Updated",
        description: "Dashboard visibility setting has been saved.",
      });
    } catch (error: any) {
      console.error('Error updating setting:', error);
      setError('Failed to update setting. Please check your permissions.');
      toast({
        title: "Error",
        description: error.message || "Failed to update setting. Please check your permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
