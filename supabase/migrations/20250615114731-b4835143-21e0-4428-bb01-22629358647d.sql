
-- Remove settings for school_name and auto_signout_hours from system_settings

DELETE FROM public.system_settings
WHERE setting_key IN ('school_name', 'auto_signout_hours');
