CREATE POLICY "vendors upload own media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vendor-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "vendors read own media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'vendor-media' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "vendors delete own media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vendor-media' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));