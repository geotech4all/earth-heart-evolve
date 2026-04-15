
-- Create quotation status enum
CREATE TYPE public.quotation_status AS ENUM ('draft', 'sent', 'approved', 'rejected', 'completed');

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_address TEXT,
  client_phone TEXT,
  project_name TEXT NOT NULL,
  project_description TEXT,
  quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status public.quotation_status NOT NULL DEFAULT 'draft',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  prepared_by UUID,
  terms_and_conditions TEXT DEFAULT 'The client will be billed upon accepting this quote. 80% payment required before rendering services. Full payment is due upon notification of report.',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotation items table
CREATE TABLE public.quotation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  phase_name TEXT,
  item_number INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  unit TEXT,
  quantity NUMERIC DEFAULT 1,
  unit_rate NUMERIC DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for quotations
CREATE POLICY "Admins and HR can manage quotations"
ON public.quotations FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

CREATE POLICY "PMs can view quotations for assigned projects"
ON public.quotations FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'project_manager') AND (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN staff s ON p.assigned_manager = s.id
      WHERE s.email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text
    )
  )
);

-- RLS policies for quotation items
CREATE POLICY "Admins and HR can manage quotation items"
ON public.quotation_items FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'))
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr'));

CREATE POLICY "PMs can view quotation items for assigned projects"
ON public.quotation_items FOR SELECT TO authenticated
USING (
  quotation_id IN (
    SELECT q.id FROM quotations q
    WHERE q.project_id IN (
      SELECT p.id FROM projects p
      JOIN staff s ON p.assigned_manager = s.id
      WHERE s.email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text
    )
  )
);

-- Add updated_at trigger for quotations
CREATE TRIGGER update_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
