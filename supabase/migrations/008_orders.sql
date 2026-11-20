-- +go migrate Up
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  subtotal_kobo BIGINT NOT NULL CHECK (subtotal_kobo >= 0),
  discount_kobo BIGINT NOT NULL DEFAULT 0 CHECK (discount_kobo >= 0),
  delivery_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (delivery_fee_kobo >= 0),
  cooler_deposit_kobo BIGINT NOT NULL DEFAULT 0 CHECK (cooler_deposit_kobo >= 0),
  vat_kobo BIGINT NOT NULL DEFAULT 0 CHECK (vat_kobo >= 0),
  total_kobo BIGINT NOT NULL CHECK (total_kobo >= 0),
  promo_code TEXT,
  delivery_zone_id UUID REFERENCES delivery_zones(id) ON DELETE SET NULL,
  delivery_address JSONB NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_profile_id ON orders(profile_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);