
-- New enums
CREATE TYPE public.project_type AS ENUM ('field', 'internal');
CREATE TYPE public.project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.review_status AS ENUM ('draft', 'submitted', 'acknowledged');
CREATE TYPE public.proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_type project_type NOT NULL DEFAULT 'field',
  client_name TEXT,
  location TEXT,
  status project_status NOT NULL DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12,2),
  assigned_manager UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins and HR can manage projects" ON public.projects FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "Project managers can view all projects" ON public.projects FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'project_manager'));
CREATE POLICY "Project managers can update assigned projects" ON public.projects FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'project_manager') AND assigned_manager IN (SELECT id FROM public.staff WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())))
  WITH CHECK (has_role(auth.uid(), 'project_manager') AND assigned_manager IN (SELECT id FROM public.staff WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- ============ PROJECT TASKS ============
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON public.project_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins and HR can manage project tasks" ON public.project_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "PMs can manage tasks on assigned projects" ON public.project_tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())))
  WITH CHECK (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- ============ PROJECT UPDATES ============
CREATE TABLE public.project_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can manage project updates" ON public.project_updates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "PMs can manage updates on assigned projects" ON public.project_updates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())))
  WITH CHECK (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- ============ PROJECT MILESTONES ============
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HR can manage milestones" ON public.project_milestones FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "PMs can manage milestones on assigned projects" ON public.project_milestones FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())))
  WITH CHECK (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- ============ PERFORMANCE REVIEWS ============
CREATE TABLE public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  reviewer_id UUID,
  review_period TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 3,
  strengths TEXT,
  areas_for_improvement TEXT,
  goals TEXT,
  status review_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add validation trigger instead of CHECK for rating
CREATE OR REPLACE FUNCTION public.validate_rating() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_performance_review_rating BEFORE INSERT OR UPDATE ON public.performance_reviews FOR EACH ROW EXECUTE FUNCTION public.validate_rating();

CREATE POLICY "Admins and HR can manage performance reviews" ON public.performance_reviews FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

-- ============ PROJECT ASSESSMENTS ============
CREATE TABLE public.project_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assessor_id UUID,
  report_quality_score INTEGER DEFAULT 0,
  field_safety_score INTEGER DEFAULT 0,
  timeline_adherence_score INTEGER DEFAULT 0,
  overall_score NUMERIC(3,1) DEFAULT 0,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_assessments ENABLE ROW LEVEL SECURITY;

-- Validation trigger for scores
CREATE OR REPLACE FUNCTION public.validate_assessment_scores() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_quality_score < 0 OR NEW.report_quality_score > 10 THEN
    RAISE EXCEPTION 'Report quality score must be between 0 and 10';
  END IF;
  IF NEW.field_safety_score < 0 OR NEW.field_safety_score > 10 THEN
    RAISE EXCEPTION 'Field safety score must be between 0 and 10';
  END IF;
  IF NEW.timeline_adherence_score < 0 OR NEW.timeline_adherence_score > 10 THEN
    RAISE EXCEPTION 'Timeline adherence score must be between 0 and 10';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_project_assessment_scores BEFORE INSERT OR UPDATE ON public.project_assessments FOR EACH ROW EXECUTE FUNCTION public.validate_assessment_scores();

CREATE POLICY "Admins and HR can manage project assessments" ON public.project_assessments FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
CREATE POLICY "PMs can view assessments on assigned projects" ON public.project_assessments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'project_manager') AND project_id IN (SELECT p.id FROM public.projects p JOIN public.staff s ON p.assigned_manager = s.id WHERE s.email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- ============ STAFF COMPETENCIES ============
CREATE TABLE public.staff_competencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level proficiency_level NOT NULL DEFAULT 'beginner',
  certification_name TEXT,
  certification_date DATE,
  expiry_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_competencies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_staff_competencies_updated_at BEFORE UPDATE ON public.staff_competencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins and HR can manage staff competencies" ON public.staff_competencies FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));
