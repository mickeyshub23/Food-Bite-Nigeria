-- seed.sql for Food Bite Services
-- Run after all migrations (001-019) are applied.

-- ---- CATEGORIES ----
INSERT INTO categories (name, slug, description, display_order, image_url) VALUES
  ('Rice Dishes', 'rice-dishes', 'Delicious Nigerian rice specialties', 1, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop'),
  ('Soups & Stews', 'soups-stews', 'Traditional soups and stews', 2, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'),
  ('Grills & Suya', 'grills-suya', 'Grilled meats and spicy suya', 3, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop'),
  ('Snacks & Sides', 'snacks-sides', 'Popular Nigerian snacks', 4, 'https://images.unsplash.com/photo-1586985289071-0a3c86b4cd70?w=400&h=300&fit=crop'),
  ('Drinks', 'drinks', 'Refreshing beverages', 5, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  image_url = EXCLUDED.image_url;

-- ---- PRODUCTS (12+ items, prices in kobo) ----
INSERT INTO products (slug, name, description, price_kobo, stock, low_stock_threshold, availability, category_id, portion_size, dietary_tags, region, is_featured, is_active, rating, rating_count, image_url) VALUES
  -- Rice Dishes
  ('jollof-rice', 'Party Jollof Rice', 'Classic Nigerian party jollof with tomatoes, peppers & spices', 180000, 12, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['vegetarian'], 'lagos', true, true, 4.7, 842, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=450&fit=crop'),

  ('fried-rice', 'Nigerian Fried Rice', 'Colorful fried rice with mixed vegetables & liver', 170000, 15, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['vegetarian'], 'abuja', true, true, 4.6, 521, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=450&fit=crop'),

  ('coconut-rice', 'Coconut Rice', 'Fragrant rice cooked in coconut milk with shrimp', 210000, 8, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'rice-dishes'), 'large', ARRAY['contains-shellfish'], 'cross_river', false, true, 4.8, 198, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=450&fit=crop'),

  -- Soups & Stews
  ('egusi-soup', 'Egusi Soup with Pounded Yam', 'Melon seed soup with assorted meat & vegetables', 150000, 10, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'soups-stews'), 'large', ARRAY['gluten-free'], 'ogun', true, true, 4.7, 631, 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&h=450&fit=crop'),

  ('ewedu-amala', 'Ewedu & Amala', 'Green jute leaf soup with yam flour swallow', 130000, 20, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'soups-stews'), 'medium', ARRAY['vegan', 'gluten-free'], 'osun', false, true, 4.5, 412, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=450&fit=crop'),

  ('ofe-akwu', 'Ofe Akwu (Palm Fruit Stew)', 'Rich palm fruit stew with smoked fish & scent leaves', 220000, 6, 5, 'low_stock',
    (SELECT id FROM categories WHERE slug = 'soups-stews'), 'large', ARRAY['contains-fish'], 'delta', false, true, 4.8, 214, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=450&fit=crop'),

  -- Grills & Suya
  ('suya-beef', 'Suya (Spiced Beef Skewers)', 'Grilled beef with yaji spice, onions & tomatoes', 250000, 25, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'grills-suya'), 'medium', ARRAY['contains-nuts'], 'kano', true, true, 4.6, 789, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=450&fit=crop'),

  ('suya-chicken', 'Chicken Suya', 'Grilled chicken thighs with traditional suya spice', 230000, 18, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'grills-suya'), 'medium', ARRAY['contains-nuts'], 'kaduna', true, true, 4.5, 345, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=450&fit=crop'),

  ('grilled-fish', 'Grilled Croaker Fish', 'Whole grilled fish with pepper sauce', 350000, 8, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'grills-suya'), 'large', ARRAY['contains-fish'], 'lagos', false, true, 4.9, 156, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=450&fit=crop'),

  -- Snacks & Sides
  ('akara', 'Akara (Bean Cakes)', 'Crispy fried bean cakes, perfect for breakfast', 30000, 30, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'small', ARRAY['vegan', 'gluten-free'], 'lagos', true, true, 4.4, 512, 'https://images.unsplash.com/photo-1623428187969-5da2dcea57e2?w=600&h=450&fit=crop'),

  ('moin-moin', 'Moin Moin (Steamed Bean Pudding)', 'Steamed bean pudding with fish & eggs', 80000, 20, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'medium', ARRAY['contains-fish', 'contains-eggs'], 'osun', false, true, 4.3, 287, 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=600&h=450&fit=crop'),

  ('puff-puff', 'Puff Puff', 'Sweet fried dough balls, Nigerian style', 15000, 50, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'snacks-sides'), 'small', ARRAY['vegetarian'], 'lagos', false, true, 4.2, 423, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=450&fit=crop'),

  -- Drinks
  ('zobo-drink', 'Zobo (Hibiscus Drink)', 'Refreshing hibiscus drink with ginger & pineapple', 12000, 40, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'drinks'), 'medium', ARRAY['vegan', 'gluten-free'], 'north', false, true, 4.5, 189, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=450&fit=crop'),

  ('kunu', 'Kunu (Millet Drink)', 'Traditional fermented millet drink', 10000, 35, 5, 'in_stock',
    (SELECT id FROM categories WHERE slug = 'drinks'), 'medium', ARRAY['vegan', 'gluten-free'], 'kano', false, true, 4.3, 134, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=450&fit=crop')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_kobo = EXCLUDED.price_kobo,
  stock = EXCLUDED.stock,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  availability = EXCLUDED.availability,
  category_id = EXCLUDED.category_id,
  portion_size = EXCLUDED.portion_size,
  dietary_tags = EXCLUDED.dietary_tags,
  region = EXCLUDED.region,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  rating = EXCLUDED.rating,
  rating_count = EXCLUDED.rating_count,
  image_url = EXCLUDED.image_url;

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
INSERT INTO testimonials (name, location, rating, content, display_order, avatar_url) VALUES
  ('Adanna S.', 'Lagos', 5, 'The Party Jollof Rice is absolutely authentic – tastes just like my mum''s!', 1, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop'),
  ('Chidi O.', 'Abuja', 5, 'Best suya delivery in Abuja. The yaji spice is perfect.', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'),
  ('Funmi K.', 'Ibadan', 4, 'Great variety and fast delivery. The Ewedu & Amala was delicious.', 3, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop'),
  ('Tunde A.', 'Port Harcourt', 5, 'Fresh grilled fish, well packaged. Will order again.', 4, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop'),
  ('Ngozi E.', 'Enugu', 4, 'Loved the Zobo drink – refreshing and not too sweet.', 5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop')
ON CONFLICT DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  rating = EXCLUDED.rating,
  content = EXCLUDED.content,
  display_order = EXCLUDED.display_order,
  avatar_url = EXCLUDED.avatar_url;

-- ---- PROMO CODE (active, 15% off min ₦25,000) ----
INSERT INTO promo_codes (code, percent, min_order_kobo, starts_at, ends_at, active, max_uses) VALUES
  ('NAIJAFEAST', 15.00, 2500000, NOW() - INTERVAL '30 days', NOW() + INTERVAL '365 days', true, 1000)
ON CONFLICT (code) DO NOTHING;