-- seed.sql for Food Bite Services
-- Run after migrations

-- Enable pgvector if needed (not used here)

-- Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Rice & Grains', 'rice-grains', 'Essential staples', 1),
  ('Soups & Stews', 'soups-stews', 'Traditional Nigerian soups', 2),
  ('Meats & Fish', 'meats-fish', 'Fresh protein selections', 3),
  ('Vegetables & Fruits', 'vegetables-fruits', 'Fresh produce', 4),
  ('Spices & Seasonings', 'spices-seasonings', 'Authentic flavours', 5);

-- Products (9 dishes from designs: 1 sold-out, 1 low-stock)
-- Prices in kobo (1 ₦ = 100 kobo), price formatting: ₦1,200 etc.
INSERT INTO products (slug, name, description, price_kobo, stock, low_stock_threshold, availability, category_id, portion_size, dietary_tags, region, is_featured, is_active, rating, rating_count) VALUES
  ('jollof-rice', 'Jollof Rice', 'Party jollof with tomatoes and peppers', 180000, 12, 5, 'in_stock', 'rice-grains', 'large', '{vegetarian}', 'lagos', true, true, 4.7, 842),
  ('eba-and-egusi', 'Eba & Egusi Soup', 'Pounded yam alternative with melon seeds', 150000, 8, 5, 'low_stock', 'soups-stews', 'medium', '{gluten-free}', 'ogun', false, true, 4.5, 631),
  ('ofe-akwu', 'Ofe Akwu (Palm Fruit Stew)', 'Rich palm fruit stew with smoked fish', 220000, 3, 5, 'sold_out', 'soups-stews', 'large', '{contains-fish}', 'delta', false, true, 4.8, 214),
  ('pounded-yam', 'Pounded Yam', 'Smooth pounded yam with vegetable soup', 200000, 15, 5, 'in_stock', 'soups-stews', 'large', '', 'osun', false, true, 4.6, 712),
  ('akara', 'Akara (Bean Cakes)', 'Fried bean cakes, breakfast favourite', 30000, 20, 5, 'in_stock', 'vegetables-fruits', 'small', '{vegan, gluten-free}', 'lagos', true, true, 4.3, 319),
  ('suya', 'Suya (Spiced Beef)', 'Grilled spiced beef skewers', 25000, 10, 5, 'in_stock', 'meats-fish', 'medium', '{contains-nuts}', 'kano', false, true, 4.4, 487),
  ('fufu', 'Fufu & Egusi', 'Classic fufu with melon seed soup', 230000, 6, 5, 'low_stock', 'soups-stews', 'large', '', 'cross_river', false, true, 4.6, 198),
  ('izak', 'Izak (Smoked Fish)', 'Freshly smoked catfish', 8000, 25, 5, 'in_stock', 'meats-fish', 'small', '', 'river_state', false, true, 4.2, 156),
  ('kulikuli', 'Kulikuli (Groundnut Cake)', 'Crunchy groundnut snack', 5000, 30, 5, 'in_stock', 'spices-seasonings', 'small', '{vegan}', 'lagos', false, true, 4.1, 283);

-- Delivery zones
INSERT INTO delivery_zones (name, fee_kobo, min_order_kobo, estimated_days, is_active) VALUES
  ('Lagos Mainland', 50000, 200000, 1, true),   -- ₦500
  ('Ibadan', 70000, 200000, 2, true),        -- ₦700
  ('Abuja', 80000, 200000, 2, true);         -- ₦800

-- Settings (store as key-value pairs)
INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'Food Bite Services', ''),
  ('vat_rate', '7.5', 'VAT percentage rate'),
  ('cooler_deposit', '500', 'Thermal cooler box deposit in naira'),
  ('promo_naijafeast', 'NAIJAFEAST|15|25000|', 'Promo code: NAIJAFEAST gives 15% off min order ₦25,000'),
  ('footer_year', '2026', 'Current year for footer'),
  ('phone', '+234-XXXX-XXXX', 'Contact phone (set actual value)'),
  ('address', 'Kano, Nigeria', 'Business address');

-- Testimonials
INSERT INTO testimonials (name, location, rating, content, avatar_url, display_order) VALUES
  ('Adanna S.', 'Lagos', 5, 'The Jollof Rice is absolutely authentic - tastes just like home!', '/placeholder-user-1.jpg', 1),
  ('Chidi O.', 'Abuja', 4, 'Great variety and fast delivery. The Eba & Egusi was delicious.', '/placeholder-user-2.jpg', 2),
  ('Funmi K.', 'Ibadan', 5, 'Perfect for busy families. Always fresh and well-packaged.', '/placeholder-user-3.jpg', 3);

-- Promo code: NAIJAFEAST (15% off, minimum order ₦25,000)
INSERT INTO promo_codes (code, percent, min_order_kobo, starts_at, ends_at, active, max_uses) VALUES
  ('NAIJAFEAST', 15.00, 2500000, NOW() - INTERVAL '30 days', NOW() + INTERVAL '365 days', true, 1000);