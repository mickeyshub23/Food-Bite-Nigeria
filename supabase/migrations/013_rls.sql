-- +go migrate Up
-- Row Level Security for all tables

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read own, admins can read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by themselves or admins" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "Profiles are insertable by themselves" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Profiles are updatable by themselves or admins" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());

-- Products: everyone can read active products, admins can manage all
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are viewable by all" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Products are manageable by admins" ON products
  FOR ALL USING (is_admin());

-- Categories: everyone can read, admins can manage
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by admins" ON categories
  FOR ALL USING (is_admin());

-- Addresses: users can manage own, admins can view all
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Addresses are viewable by owner or admin" ON addresses
  FOR SELECT USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Addresses are insertable by owner" ON addresses
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Addresses are updatable by owner or admin" ON addresses
  FOR UPDATE USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Addresses are deletable by owner or admin" ON addresses
  FOR DELETE USING (profile_id = auth.uid() OR is_admin());

-- Delivery zones: everyone can read, admins can manage
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Delivery zones are viewable by all" ON delivery_zones
  FOR SELECT USING (true);

CREATE POLICY "Delivery zones are manageable by admins" ON delivery_zones
  FOR ALL USING (is_admin());

-- Settings: everyone can read, admins can manage
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by all" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are manageable by admins" ON settings
  FOR ALL USING (is_admin());

-- Promo codes: authenticated users can read, admins can manage
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promo codes are viewable by authenticated" ON promo_codes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Promo codes are manageable by admins" ON promo_codes
  FOR ALL USING (is_admin());

-- Orders: users can see own, admins can see all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are viewable by owner or admin" ON orders
  FOR SELECT USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Orders are insertable by authenticated" ON orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Orders are updatable by admin only" ON orders
  FOR UPDATE USING (is_admin());

-- Order items: visible through order ownership, admin can see all
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items are viewable by order owner or admin" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND profile_id = auth.uid())
    OR is_admin()
  );

-- Payments: visible through order ownership, admin can see all
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payments are viewable by order owner or admin" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = payments.order_id AND profile_id = auth.uid())
    OR is_admin()
  );

-- Testimonials: everyone can read, admins can manage
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active testimonials are viewable by all" ON testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Testimonials are manageable by admins" ON testimonials
  FOR ALL USING (is_admin());

-- Contact messages: admins can view all, anyone can insert
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact messages are viewable by admin" ON contact_messages
  FOR SELECT USING (is_admin());

CREATE POLICY "Contact messages are insertable by anyone" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages are updatable by admin" ON contact_messages
  FOR UPDATE USING (is_admin());

-- +go migrate Down
-- RLS is not easily reversible; drop policies instead
-- (This is intentionally empty - RLS cannot be cleanly undone)