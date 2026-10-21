INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('documentos', 'documentos', true, 52428800)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar archivos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden consultar archivos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documentos');

DROP POLICY IF EXISTS "Usuarios autenticados pueden subir archivos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden subir archivos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documentos');

DROP POLICY IF EXISTS "Usuarios autenticados pueden reemplazar archivos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden reemplazar archivos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documentos')
  WITH CHECK (bucket_id = 'documentos');

DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar archivos" ON storage.objects;
CREATE POLICY "Usuarios autenticados pueden eliminar archivos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documentos');
