-- Create sequence for quote numbers
CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq START WITH 6;

-- Function to generate next quote number
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num integer;
  year_suffix text;
BEGIN
  next_num := nextval('public.quotation_number_seq');
  year_suffix := to_char(CURRENT_DATE, 'YY');
  RETURN 'S-' || year_suffix || '-' || lpad(next_num::text, 4, '0');
END;
$$;

-- Set default on quotations table so new inserts auto-get a quote number
ALTER TABLE public.quotations ALTER COLUMN quote_number SET DEFAULT public.generate_quote_number();