-- +go migrate Up
-- Fix: add missing is_active column to categories + grant public read access

-- Add is_active column to categories (migration 002 was missing it)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- RLS: enable and create policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

-- RLS: enable and create policies for products (active rows only for anon)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_active" ON products
  FOR SELECT USING (is_active = true);

-- RLS: enable and create policies for testimonials (active rows only)
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