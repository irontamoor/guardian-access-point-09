CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES system_users(id) ON DELETE CASCADE,
  notify_student_check_in boolean DEFAULT false,
  notify_student_check_out boolean DEFAULT false,
  notify_staff_check_in boolean DEFAULT false,
  notify_staff_check_out boolean DEFAULT false,
  notify_visitor_check_in boolean DEFAULT false,
  notify_visitor_check_out boolean DEFAULT false,
  notify_parent_pickup boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (true);

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO public.notification_preferences (user_id, 
  notify_student_check_in, notify_student_check_out,
  notify_staff_check_in, notify_staff_check_out,
  notify_visitor_check_in, notify_visitor_check_out,
  notify_parent_pickup)
SELECT id, true, true, true, true, true, true, true
FROM system_users
WHERE role IN ('admin', 'reader', 'staff_admin')
ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE student_attendance;
ALTER TABLE student_attendance REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE staff_attendance;
ALTER TABLE staff_attendance REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE visitor_records;
ALTER TABLE visitor_records REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE parent_pickup_records;
ALTER TABLE parent_pickup_records REPLICA IDENTITY FULL;