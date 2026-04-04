
-- Create staff status enum
CREATE TYPE public.staff_status AS ENUM ('onboarding', 'active', 'inactive');

-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view departments"
  ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and HR can manage departments"
  ON public.departments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

-- Staff roles table (custom job roles)
CREATE TABLE public.staff_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view staff roles"
  ON public.staff_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and HR can manage staff roles"
  ON public.staff_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

-- Staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES public.staff_roles(id) ON DELETE SET NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.staff_status NOT NULL DEFAULT 'onboarding',
  profile_photo_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can view staff"
  ON public.staff FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));
CREATE POLICY "Admins and HR can manage staff"
  ON public.staff FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Onboarding checklists
CREATE TABLE public.onboarding_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.onboarding_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can view onboarding checklists"
  ON public.onboarding_checklists FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));
CREATE POLICY "Admins and HR can manage onboarding checklists"
  ON public.onboarding_checklists FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

-- Staff documents
CREATE TABLE public.staff_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can view staff documents"
  ON public.staff_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));
CREATE POLICY "Admins and HR can manage staff documents"
  ON public.staff_documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

-- Storage bucket for staff documents
INSERT INTO storage.buckets (id, name, public) VALUES ('staff-documents', 'staff-documents', false);

CREATE POLICY "Admins and HR can upload staff documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'staff-documents' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr')));

CREATE POLICY "Admins and HR can view staff documents storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'staff-documents' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr')));

CREATE POLICY "Admins and HR can delete staff documents storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'staff-documents' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr')));
