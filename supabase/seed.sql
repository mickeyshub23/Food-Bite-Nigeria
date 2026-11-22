-- seed.sql for Food Bite Services
-- Run after all migrations (001-019) are applied.

-- ---- CATEGORIES ----
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Rice Dishes', 'rice-dishes', 'Delicious Nigerian rice specialties', 1),
  ('Soups & Stews', 'soups-stews', 'Traditional soups and stews', 2),
  ('Grills & Suya', 'grills-suya', 'Grilled meats and spicy suya', 3),
  ('Snacks & Sides', 'snacks-sides', 'Popular Nigerian snacks', 4),
  ('Drinks', 'drinks', 'Refreshing beverages', 5)
ON CONFLICT (slug) DO NOTHING;

-- ---- PRODUCTS (12+ items, prices in kobo) ----
INSERT INTO products (slug, name, description, price_kobo, stock, low_stock_threshold, availability, category_id, portion_size, dietary_tags, region, is_featured, is_active, rating, rating_count) VALUES
  -- Rice Dishes
  ('jollof-rice', 'Party Jollof Rice', 'Classic Nigerian party jollof with tomatoes, peppers & spices', 180000, 12, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['vegetarian'], 'lagos', true, true, 4.7, 842),

  ('fried-rice', 'Nigerian Fried Rice', 'Colorful fried rice with mixed vegetables & liver', 170000, 15, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['vegetarian'], 'abuja', true, true, 4.6, 521),

  ('coconut-rice', 'Coconut Rice', 'Fragrant rice cooked in coconut milk with shrimp', 210000, 8, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['contains-shellfish'], 'cross_river', false, true, 4.8, 198),

  -- Soups & Stews
  ('egusi-soup', 'Egusi Soup with Pounded Yam', 'Melon seed soup with assorted meat & vegetables', 150000, 10, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'soups-stews'), 'large', ARRAY['gluten-free'], 'ogun', true, true, 4.7, 631),

  ('ewedu-amala', 'Ewedu & Amala', 'Green jute leaf soup with yam flour swallow', 130000, 20, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'soups-stews'), 'medium', ARRAY['vegan', 'gluten-free'], 'osun', false, true, 4.5, 412),

  ('ofe-akwu', 'Ofe Akwu (Palm Fruit Stew)', 'Rich palm fruit stew with smoked fish & scent leaves', 220000, 6, 5, 'low_stock',
   (SELECT id FROM categories WHERE slug = 'soups-stews'), 'large', ARRAY['contains-fish'], 'delta', false, true, 4.8, 214),

  -- Grills & Suya
  ('suya-beef', 'Suya (Spiced Beef Skewers)', 'Grilled beef with yaji spice, onions & tomatoes', 250000, 25, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'grills-suya'), 'medium', ARRAY['contains-nuts'], 'kano', true, true, 4.6, 789),

  ('suya-chicken', 'Chicken Suya', 'Grilled chicken thighs with traditional suya spice', 230000, 18, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'grills-suya'), 'medium', ARRAY['contains-nuts'], 'kaduna', true, true, 4.5, 345),

  ('grilled-fish', 'Grilled Croaker Fish', 'Whole grilled fish with pepper sauce', 350000, 8, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'grills-suya'), 'large', ARRAY['contains-fish'], 'lagos', false, true, 4.9, 156),

  -- Snacks & Sides
  ('akara', 'Akara (Bean Cakes)', 'Crispy fried bean cakes, perfect for breakfast', 30000, 30, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'small', ARRAY['vegan', 'gluten-free'], 'lagos', true, true, 4.4, 512),

  ('moin-moin', 'Moin Moin (Steamed Bean Pudding)', 'Steamed bean pudding with fish & eggs', 80000, 20, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'medium', ARRAY['contains-fish', 'contains-eggs'], 'osun', false, true, 4.3, 287),

  ('puff-puff', 'Puff Puff', 'Sweet fried dough balls, Nigerian style', 15000, 50, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'small', ARRAY['vegetarian'], 'lagos', false, true, 4.2, 423),

  -- Drinks
  ('zobo-drink', 'Zobo (Hibiscus Drink)', 'Refreshing hibiscus drink with ginger & pineapple', 12000, 40, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'drinks'), 'medium', ARRAY['vegan', 'gluten-free'], 'north', false, true, 4.5, 189),

  ('kunu', 'Kunu (Millet Drink)', 'Traditional fermented millet drink', 10000, 35, 5, 'in_stock',
   (SELECT id FROM categories WHERE slug = 'drinks'), 'medium', ARRAY['vegan', 'gluten-free'], 'kano', false, true, 4.3, 134)

ON CONFLICT (slug) DO NOTHING;

-- ---- DELIVERY ZONES ----
INSERT INTO delivery_zones (name, fee_kobo, min_order_kobo, estimated_days, is_active) VALUES
  ('Lagos Mainland', 50000, 200000, 1, true),
  ('Lagos Island', 60000, 200000, 1, true),
  ('Ibadan', 70000, 200000, 2, true),
  ('Abuja', 80000, 200000, 2, true),
  ('Port Harcourt', 90000, 250000, 2, true)
ON CONFLICT (name) DO NOTHING;

-- ---- SETTINGS ----
INSERT INTO settings (key, value, description) VALUES
  ('site_name', 'Food Bite Services', ''),
  ('vat_rate', '7.5', 'VAT percentage rate'),
  ('cooler_deposit_kobo', '50000', 'Thermal cooler box deposit in kobo (₦500)'),
  ('footer_year', '2026', 'Current year for footer'),
  ('phone', '+234-800-FOOD-BITE', 'Contact phone'),
  ('address', 'Lagos, Nigeria', 'Business address')
ON CONFLICT (key) DO NOTHING;

-- ---- TESTIMONIALS ----
INSERT INTO testimonials (name, location, rating, content, display_order) VALUES
  ('Adanna S.', 'Lagos', 5, 'The Party Jollof Rice is absolutely authentic – tastes just like my mum''s!', 1),
  ('Chidi O.', 'Abuja', 5, 'Best suya delivery in Abuja. The yaji spice is perfect.', 2),
  ('Funmi K.', 'Ibadan', 4, 'Great variety and fast delivery. The Ewedu & Amala was delicious.', 3),
  ('Tunde A.', 'Port Harcourt', 5, 'Fresh grilled fish, well packaged. Will order again.', 4),
  ('Ngozi E.', 'Enugu', 4, 'Loved the Zobo drink – refreshing and not too sweet.', 5)
ON CONFLICT DO NOTHING;

-- ---- PROMO CODE (active, 15% off min ₦25,000) ----
INSERT INTO promo_codes (code, percent, min_order_kobo, starts_at, ends_at, active, max_uses) VALUES
  ('NAIJAFEAST', 15.00, 2500000, NOW() - INTERVAL '30 days', NOW() + INTERVAL '365 days', true, 1000)
ON CONFLICT (code) DO NOTHING;