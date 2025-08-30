-- Create dedicated tables for each form type

-- Student attendance table
CREATE TABLE public.student_attendance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    status public.attendance_status NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Staff attendance table
CREATE TABLE public.staff_attendance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    status public.attendance_status NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Visitor records table
CREATE TABLE public.visitor_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    organization TEXT,
    visit_purpose TEXT NOT NULL,
    host_name TEXT,
    phone_number TEXT,
    notes TEXT,
    check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    status public.attendance_status NOT NULL DEFAULT 'in',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Parent pickup records table
CREATE TABLE public.parent_pickup_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT,
    parent_guardian_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    pickup_type TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('pickup', 'dropoff')),
    notes TEXT,
    action_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_pickup_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all access for now since this is an admin system)
CREATE POLICY "Allow public access to student_attendance" ON public.student_attendance FOR ALL USING (true);
CREATE POLICY "Allow public access to staff_attendance" ON public.staff_attendance FOR ALL USING (true);
CREATE POLICY "Allow public access to visitor_records" ON public.visitor_records FOR ALL USING (true);
CREATE POLICY "Allow public access to parent_pickup_records" ON public.parent_pickup_records FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_student_attendance_created_at ON public.student_attendance(created_at DESC);
CREATE INDEX idx_staff_attendance_created_at ON public.staff_attendance(created_at DESC);
CREATE INDEX idx_visitor_records_created_at ON public.visitor_records(created_at DESC);
CREATE INDEX idx_parent_pickup_records_created_at ON public.parent_pickup_records(created_at DESC);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_student_attendance_updated_at
    BEFORE UPDATE ON public.student_attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_attendance_updated_at
    BEFORE UPDATE ON public.staff_attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visitor_records_updated_at
    BEFORE UPDATE ON public.visitor_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parent_pickup_records_updated_at
    BEFORE UPDATE ON public.parent_pickup_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();