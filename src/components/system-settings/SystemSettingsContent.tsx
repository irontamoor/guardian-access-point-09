
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  notify_student_check_in: boolean;
  notify_student_check_out: boolean;
  notify_staff_check_in: boolean;
  notify_staff_check_out: boolean;
  notify_visitor_check_in: boolean;
  notify_visitor_check_out: boolean;
  notify_parent_pickup: boolean;
}

export function SystemSettingsContent() {
  const { settings, loading, updateSetting } = useSystemSettings();
  const [error, setError] = useState<string | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const { toast } = useToast();

  // Load notification preferences
  useEffect(() => {
    const loadNotificationPrefs = async () => {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return;
      
      const session = JSON.parse(sessionData);
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', session.id)
        .single();
      
      if (data) {
        setNotificationPrefs(data);
      }
    };

    loadNotificationPrefs();
  }, []);

  const updateVisibilitySetting = async (key: keyof typeof settings.dashboard_visibility, value: boolean) => {
    try {
      setError(null);
      const newVisibility = { ...settings.dashboard_visibility, [key]: value };
      updateSetting('dashboard_visibility', newVisibility);

      toast({
        title: "Setting Updated",
        description: "Dashboard visibility setting has been saved.",
      });
    } catch (error: any) {
      console.error('Error updating setting:', error);
      setError('Failed to update setting.');
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive"
      });
    }
  };

  const updatePhotoSetting = async (key: keyof typeof settings.photo_capture_settings, value: boolean) => {
    try {
      setError(null);
      const newPhotoSettings = { ...settings.photo_capture_settings, [key]: value };
      updateSetting('photo_capture_settings', newPhotoSettings);

      toast({
        title: "Setting Updated",
        description: `Photo capture ${value ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error: any) {
      console.error('Error updating photo setting:', error);
      setError('Failed to update photo setting.');
      toast({
        title: "Error",
        description: "Failed to update photo setting.",
        variant: "destructive"
      });
    }
  };

  const updateNotificationPref = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData || !notificationPrefs) return;
      
      const session = JSON.parse(sessionData);
      
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [key]: value })
        .eq('user_id', session.id);

      if (error) throw error;

      setNotificationPrefs({ ...notificationPrefs, [key]: value });
      
      toast({
        title: "Notification Updated",
        description: `Notification preference saved successfully.`,
      });
    } catch (error: any) {
      console.error('Error updating notification preference:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preference.",
        variant: "destructive"
      });
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
              checked={settings.dashboard_visibility.showStudentCheckIn}
              onCheckedChange={(checked) => updateVisibilitySetting('showStudentCheckIn', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="staff-signin">Staff Sign-In</Label>
            <Switch
              id="staff-signin"
              checked={settings.dashboard_visibility.showStaffSignIn}
              onCheckedChange={(checked) => updateVisibilitySetting('showStaffSignIn', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="visitor-registration">Visitor Registration</Label>
            <Switch
              id="visitor-registration"
              checked={settings.dashboard_visibility.showVisitorRegistration}
              onCheckedChange={(checked) => updateVisibilitySetting('showVisitorRegistration', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="parent-pickup">Parent Pickup</Label>
            <Switch
              id="parent-pickup"
              checked={settings.dashboard_visibility.showParentPickup}
              onCheckedChange={(checked) => updateVisibilitySetting('showParentPickup', checked)}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photo Capture Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="student-photo">Student Photo Required</Label>
              <p className="text-sm text-muted-foreground">
                Require photo capture for student sign-in/out
              </p>
            </div>
            <Switch
              id="student-photo"
              checked={settings.photo_capture_settings.requireStudentPhoto}
              onCheckedChange={(checked) => updatePhotoSetting('requireStudentPhoto', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="staff-photo">Staff Photo Required</Label>
              <p className="text-sm text-muted-foreground">
                Require photo capture for staff sign-in/out
              </p>
            </div>
            <Switch
              id="staff-photo"
              checked={settings.photo_capture_settings.requireStaffPhoto}
              onCheckedChange={(checked) => updatePhotoSetting('requireStaffPhoto', checked)}
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="visitor-photo">Visitor Photo Required</Label>
              <p className="text-sm text-muted-foreground">
                Require photo capture for visitor check-in/out
              </p>
            </div>
            <Switch
              id="visitor-photo"
              checked={settings.photo_capture_settings.requireVisitorPhoto}
              onCheckedChange={(checked) => updatePhotoSetting('requireVisitorPhoto', checked)}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Student Check-In</Label>
              <Switch
                checked={notificationPrefs?.notify_student_check_in || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_student_check_in', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Student Check-Out</Label>
              <Switch
                checked={notificationPrefs?.notify_student_check_out || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_student_check_out', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Staff Check-In</Label>
              <Switch
                checked={notificationPrefs?.notify_staff_check_in || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_staff_check_in', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Staff Check-Out</Label>
              <Switch
                checked={notificationPrefs?.notify_staff_check_out || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_staff_check_out', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Visitor Check-In</Label>
              <Switch
                checked={notificationPrefs?.notify_visitor_check_in || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_visitor_check_in', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Visitor Check-Out</Label>
              <Switch
                checked={notificationPrefs?.notify_visitor_check_out || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_visitor_check_out', checked)}
                disabled={!notificationPrefs}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Parent Pickup/Dropoff</Label>
              <Switch
                checked={notificationPrefs?.notify_parent_pickup || false}
                onCheckedChange={(checked) => updateNotificationPref('notify_parent_pickup', checked)}
                disabled={!notificationPrefs}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
