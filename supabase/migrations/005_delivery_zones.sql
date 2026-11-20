-- +go migrate Up
CREATE TABLE delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  fee_kobo BIGINT NOT NULL CHECK (fee_kobo >= 0),
  min_order_kobo BIGINT DEFAULT 0 CHECK (min_order_kobo >= 0),
  estimated_days INTEGER DEFAULT 1 CHECK (estimated_days >= 1),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- +go migrate Down
DROP TABLE IF EXISTS delivery_zones CASCADE;