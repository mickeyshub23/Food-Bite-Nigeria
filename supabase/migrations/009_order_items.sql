-- +go migrate Up
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price_kobo BIGINT NOT NULL CHECK (unit_price_kobo >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total_kobo BIGINT NOT NULL CHECK (line_total_kobo >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- +go migrate Down
DROP TABLE IF EXISTS order_items CASCADE;