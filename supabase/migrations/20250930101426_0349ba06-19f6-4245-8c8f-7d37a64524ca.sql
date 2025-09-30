-- Create students table
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  grade text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create staff table
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  department text,
  position text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Public can read active students"
  ON public.students
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can insert students"
  ON public.students
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update students"
  ON public.students
  FOR UPDATE
  USING (true);

-- Create policies for staff table
CREATE POLICY "Public can read active staff"
  ON public.staff
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can insert staff"
  ON public.staff
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update staff"
  ON public.staff
  FOR UPDATE
  USING (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_staff_employee_id ON public.staff(employee_id);