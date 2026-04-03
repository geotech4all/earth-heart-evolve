INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

CREATE POLICY "Public read access for assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Admins can upload assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'));