-- +go migrate Up
-- Add staff role to profiles CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin', 'staff'));

-- Storage: ensure product-images bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'product-images';

-- Ensure authenticated can read public tables
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON testimonials TO authenticated;
GRANT SELECT ON delivery_zones TO authenticated;
GRANT SELECT ON settings TO authenticated;

-- Ensure authenticated customers can manage their own addresses
GRANT SELECT ON addresses TO authenticated;
GRANT INSERT ON addresses TO authenticated;
GRANT UPDATE ON addresses TO authenticated;
GRANT DELETE ON addresses TO authenticated;