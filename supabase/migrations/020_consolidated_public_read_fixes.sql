-- +go migrate Up
-- Consolidated fix: ensure all columns, RLS policies, and anon grants exist for public read tables.
-- Idempotent (safe to re-run). Apply this on the production Supabase project.
-- Run AFTER migrations 001-019, then run supabase/seed.sql.

-- ---- Categories: ensure is_active column exists ----
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
UPDATE categories SET is_active = true WHERE is_active IS NULL;

-- ---- Products: ensure columns exist ----
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
UPDATE products SET is_active = true WHERE is_active IS NULL;
UPDATE products SET is_featured = false WHERE is_featured IS NULL;

-- ---- Testimonials: ensure columns exist ----
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
UPDATE testimonials SET is_active = true WHERE is_active IS NULL;

-- ---- Delivery zones: ensure is_active column exists ----
ALTER TABLE delivery_zones ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
UPDATE delivery_zones SET is_active = true WHERE is_active IS NULL;

-- ---- RLS policies (drop+create idempotently) ----

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories_select_all" ON categories;
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);

-- Products (anon sees active only)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_select_active" ON products;
CREATE POLICY "products_select_active" ON products FOR SELECT USING (is_active = true);

-- Testimonials (anon sees active only)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_select_active" ON testimonials;
CREATE POLICY "testimonials_select_active" ON testimonials FOR SELECT USING (is_active = true);

-- Delivery zones
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "delivery_zones_select_all" ON delivery_zones;
CREATE POLICY "delivery_zones_select_all" ON delivery_zones FOR SELECT USING (true);

-- Settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_select_all" ON settings;
CREATE POLICY "settings_select_all" ON settings FOR SELECT USING (true);

-- ---- Grants to anon and authenticated ----
GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON testimonials TO anon;
GRANT SELECT ON testimonials TO authenticated;
GRANT SELECT ON delivery_zones TO anon;
GRANT SELECT ON delivery_zones TO authenticated;
GRANT SELECT ON settings TO anon;
GRANT SELECT ON settings TO authenticated;

-- Column-level grants (defensive, redundant with table grants but ensures anon column access)
GRANT SELECT (id, name, slug, description, display_order, is_active, image_url) ON categories TO anon;
GRANT SELECT (id, slug, name, price_kobo, stock, availability, is_featured, is_active, image_url, rating, rating_count) ON products TO anon;
GRANT SELECT (id, name, location, rating, content, is_active, display_order, avatar_url) ON testimonials TO anon;
GRANT SELECT (key, value) ON settings TO anon;
GRANT SELECT (name, fee_kobo, min_order_kobo, estimated_days, is_active) ON delivery_zones TO anon;

-- ---- Storage bucket for product images ----
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
DROP POLICY IF EXISTS "product-images_public_read" ON storage.objects;
CREATE POLICY "product-images_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
