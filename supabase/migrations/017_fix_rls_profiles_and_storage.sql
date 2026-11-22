-- +go migrate Up
-- Fix: add missing is_active column to categories + grant public read access
-- Idempotent: uses IF NOT EXISTS / DROP IF EXISTS to allow re-running

-- Add is_active column to categories (migration 002 was missing it)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
UPDATE categories SET is_active = true WHERE is_active IS NULL;

-- Add updated_at column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- RLS: enable and create policies for categories (idempotent with DROP IF EXISTS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON categories;
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

-- Products: select active rows only
DROP POLICY IF EXISTS "products_select_active" ON products;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_active" ON products
  FOR SELECT USING (is_active = true);

-- Testimonials: select active rows only
DROP POLICY IF EXISTS "testimonials_select_active" ON testimonials;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select_active" ON testimonials
  FOR SELECT USING (is_active = true);

-- GRANT SELECT to anon and authenticated for public read tables
GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON testimonials TO anon;
GRANT SELECT ON testimonials TO authenticated;
GRANT SELECT ON settings TO anon;
GRANT SELECT ON settings TO authenticated;
GRANT SELECT ON delivery_zones TO anon;
GRANT SELECT ON delivery_zones TO authenticated;

-- Profiles RLS: users can read their own row (already in 013; ensure consistent state)
-- No new grant: anon cannot read profiles (RLS blocks them); authenticated reads handled via profile_id foreign keys;

-- Storage bucket: product-images should be public read
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: public can read product images
DROP POLICY IF EXISTS "product-images_public_read" ON storage.objects;
CREATE POLICY "product-images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Storage RLS: admin can upload/update/delete product images
DROP POLICY IF EXISTS "product-images_admin_ops" ON storage.objects;
CREATE POLICY "product-images_admin_ops" ON storage.objects
  FOR ALL USING (
    bucket_id = 'product-images'
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Grant anon column-level SELECT on products & testimonials for active rows only
GRANT SELECT (id, name, slug, description, image_url, display_order, is_active) ON categories TO anon;
GRANT SELECT (id, slug, name, price_kobo, stock, availability, is_featured, is_active, image_url) ON products TO anon;
GRANT SELECT (id, name, location, rating, content, is_active, display_order) ON testimonials TO anon;