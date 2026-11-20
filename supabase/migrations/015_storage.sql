-- +go migrate Up
-- Storage bucket for product images (created via Supabase dashboard or API)
-- This migration documents the required bucket configuration

-- The product-images bucket should be created with:
-- - Public read access
-- - Admin-only write access (via RLS or service-role)

-- Example SQL to create (run in Supabase SQL editor if not using dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage RLS policies (run in Supabase SQL editor):
-- CREATE POLICY "Product images are publicly readable" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
--
-- CREATE POLICY "Admins can upload product images" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'product-images'
--     AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );
--
-- CREATE POLICY "Admins can update product images" ON storage.objects
--   FOR UPDATE USING (
--     bucket_id = 'product-images'
--     AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );
--
-- CREATE POLICY "Admins can delete product images" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'product-images'
--     AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- +go migrate Down
-- No-op: storage bucket management is done via Supabase dashboard