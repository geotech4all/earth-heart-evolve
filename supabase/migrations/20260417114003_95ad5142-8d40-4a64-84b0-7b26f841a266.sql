
-- Helper: securely return current user's email without exposing auth.users in RLS
CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid()
$$;

-- quotations
DROP POLICY IF EXISTS "PMs can view quotations for assigned projects" ON public.quotations;
CREATE POLICY "PMs can view quotations for assigned projects"
ON public.quotations FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
);

-- quotation_items
DROP POLICY IF EXISTS "PMs can view quotation items for assigned projects" ON public.quotation_items;
CREATE POLICY "PMs can view quotation items for assigned projects"
ON public.quotation_items FOR SELECT TO authenticated
USING (
  quotation_id IN (
    SELECT q.id FROM quotations q
    WHERE q.project_id IN (
      SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
      WHERE s.email = public.current_user_email()
    )
  )
);

-- projects
DROP POLICY IF EXISTS "Project managers can update assigned projects" ON public.projects;
CREATE POLICY "Project managers can update assigned projects"
ON public.projects FOR UPDATE TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND assigned_manager IN (SELECT id FROM staff WHERE email = public.current_user_email())
)
WITH CHECK (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND assigned_manager IN (SELECT id FROM staff WHERE email = public.current_user_email())
);

-- project_assessments
DROP POLICY IF EXISTS "PMs can view assessments on assigned projects" ON public.project_assessments;
CREATE POLICY "PMs can view assessments on assigned projects"
ON public.project_assessments FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
);

-- project_milestones
DROP POLICY IF EXISTS "PMs can manage milestones on assigned projects" ON public.project_milestones;
CREATE POLICY "PMs can manage milestones on assigned projects"
ON public.project_milestones FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
)
WITH CHECK (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
);

-- project_tasks
DROP POLICY IF EXISTS "PMs can manage tasks on assigned projects" ON public.project_tasks;
CREATE POLICY "PMs can manage tasks on assigned projects"
ON public.project_tasks FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
)
WITH CHECK (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
);

-- project_updates
DROP POLICY IF EXISTS "PMs can manage updates on assigned projects" ON public.project_updates;
CREATE POLICY "PMs can manage updates on assigned projects"
ON public.project_updates FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
)
WITH CHECK (
  has_role(auth.uid(), 'project_manager'::app_role)
  AND project_id IN (
    SELECT p.id FROM projects p JOIN staff s ON p.assigned_manager = s.id
    WHERE s.email = public.current_user_email()
  )
);
