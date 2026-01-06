import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationPreferences {
  notify_student_check_in: boolean;
  notify_student_check_out: boolean;
  notify_staff_check_in: boolean;
  notify_staff_check_out: boolean;
  notify_visitor_check_in: boolean;
  notify_visitor_check_out: boolean;
  notify_parent_pickup: boolean;
}

// Get admin_id from localStorage session for secure RPC calls
const getAdminId = (): string | null => {
  try {
    const sessionData = localStorage.getItem('admin_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      return session.admin_id || null;
    }
  } catch {
    return null;
  }
  return null;
};

export const useRealtimeNotifications = (userId: string | null, enabled: boolean = true) => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  // Load notification preferences via secure RPC
  useEffect(() => {
    if (!userId || !enabled) return;

    const loadPreferences = async () => {
      const adminId = getAdminId();
      if (!adminId) return;

      const { data, error } = await supabase.rpc('get_notification_preferences', {
        p_admin_id: adminId,
        p_user_id: userId
      });

      if (data && data.length > 0) {
        setPreferences(data[0]);
      }
    };

    loadPreferences();
  }, [userId, enabled]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId || !enabled || !preferences) return;

    const channels: any[] = [];

    // Student attendance notifications
    if (preferences.notify_student_check_in || preferences.notify_student_check_out) {
      const studentChannel = supabase
        .channel('student-attendance-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'student_attendance'
          },
          (payload) => {
            const record = payload.new as any;
            if (record.status === 'in' && preferences.notify_student_check_in) {
              toast.success(`Student Check-In`, {
                description: `${record.student_name} has checked in`,
                duration: 5000,
              });
            } else if (record.status === 'out' && preferences.notify_student_check_out) {
              toast.info(`Student Check-Out`, {
                description: `${record.student_name} has checked out`,
                duration: 5000,
              });
            }
          }
        )
        .subscribe();
      channels.push(studentChannel);
    }

    // Staff attendance notifications
    if (preferences.notify_staff_check_in || preferences.notify_staff_check_out) {
      const staffChannel = supabase
        .channel('staff-attendance-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'staff_attendance'
          },
          (payload) => {
            const record = payload.new as any;
            if (record.status === 'in' && preferences.notify_staff_check_in) {
              toast.success(`Staff Check-In`, {
                description: `${record.employee_name} has checked in`,
                duration: 5000,
              });
            } else if (record.status === 'out' && preferences.notify_staff_check_out) {
              toast.info(`Staff Check-Out`, {
                description: `${record.employee_name} has checked out`,
                duration: 5000,
              });
            }
          }
        )
        .subscribe();
      channels.push(staffChannel);
    }

    // Visitor notifications
    if (preferences.notify_visitor_check_in || preferences.notify_visitor_check_out) {
      const visitorChannel = supabase
        .channel('visitor-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'visitor_records'
          },
          (payload) => {
            const record = payload.new as any;
            if (payload.eventType === 'INSERT' && preferences.notify_visitor_check_in) {
              toast.success(`Visitor Arrival`, {
                description: `${record.first_name} ${record.last_name} has checked in`,
                duration: 5000,
              });
            } else if (payload.eventType === 'UPDATE' && record.status === 'out' && preferences.notify_visitor_check_out) {
              toast.info(`Visitor Departure`, {
                description: `${record.first_name} ${record.last_name} has checked out`,
                duration: 5000,
              });
            }
          }
        )
        .subscribe();
      channels.push(visitorChannel);
    }

    // Parent pickup notifications
    if (preferences.notify_parent_pickup) {
      const pickupChannel = supabase
        .channel('parent-pickup-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'parent_pickup_records'
          },
          (payload) => {
            const record = payload.new as any;
            const actionType = record.action_type === 'pickup' ? 'picked up' : 'dropped off';
            toast.success(`Parent Pickup/Dropoff`, {
              description: `${record.student_name} was ${actionType} by ${record.parent_guardian_name}`,
              duration: 5000,
            });
          }
        )
        .subscribe();
      channels.push(pickupChannel);
    }

    // Cleanup
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [userId, enabled, preferences]);

  return { preferences, setPreferences };
};
