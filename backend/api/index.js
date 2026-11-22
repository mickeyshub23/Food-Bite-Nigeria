import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Build allowed CORS origins from comma-separated FRONTEND_URL
function getAllowedOrigins() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:5173';
  const origins = raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  // Always allow local Vite dev server outside production
  if (process.env.NODE_ENV !== 'production' && !origins.includes('http://localhost:5173')) {
    origins.push('http://localhost:5173');
  }

  return origins;
}

const allowedOrigins = getAllowedOrigins();

// Security middleware
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow requests with no Origin header (server-to-server, curl, health checks)
    if (!origin) return callback(null, true);

    const normalized = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: { message: 'Too many requests, please try again later.' } }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Supabase client (service role) - validate env vars at startup
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Supabase anon client for JWT verification (uses service role for admin checks)
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware: Verify Supabase JWT from Authorization header
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Authorization header required' } });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }

  // Attach user to request
  req.user = user;
  next();
}

// Middleware: Require admin or staff role
async function requireStaff(req, res, next) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return res.status(403).json({ error: { message: 'Forbidden - staff or admin only' } });
    }

    req.profile = profile;
    next();
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

// Helper: get settings value
async function getSetting(key, defaultValue = null) {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error || !data) return defaultValue;
  return data.value;
}

// Helper: calculate VAT
function calculateVAT(amountKobo, vatRate) {
  return Math.round(amountKobo * (parseFloat(vatRate) / 100));
}

// Legacy isAdmin (deprecated, use requireStaff)
async function isAdmin(userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return profile?.role === 'admin';
}

// Paystack configuration
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';

// Helper: format kobo to naira
const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();

// Helper: verify Paystack payment
async function verifyPaystackTransaction(reference) {
  const url = `${PAYSTACK_BASE}/transaction/verify/${reference}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
}

// Helper: initialize Paystack transaction
async function initializePaystackTransaction(email, amount, reference, callbackUrl) {
  const url = `${PAYSTACK_BASE}/transaction/initialize`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url: callbackUrl,
      currency: 'NGN'
    })
  });
  return await response.json();
}

// ========== HEALTH ==========
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========== PRODUCTS ==========
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, search, sort, page, limit } = req.query;
    let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sorting
    const sortOptions = {
      'price_asc': 'price_kobo.asc',
      'price_desc': 'price_kobo.desc',
      'rating_desc': 'rating.desc',
      'name_asc': 'name.asc',
      'newest': 'created_at.desc'
    };
    if (sort && sortOptions[sort]) {
      const [field, order] = sortOptions[sort].split('.');
      query = query.order(field, { ascending: order === 'asc' });
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum - 1;
    query = query.range(start, end);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data, count, page: pageNum, limit: limitNum });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', req.params.slug)
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(404).json({ error: { message: 'Product not found' } });
  }
});

// ========== CATEGORIES ==========
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== CART VALIDATION ==========
app.post('/api/cart/validate', async (req, res) => {
  try {
    const { items } = req.body; // [{ product_id, quantity }]
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: { message: 'Invalid cart items' } });
    }

    const validated = [];
    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (error || !product) {
        validated.push({ product_id: item.product_id, valid: false, reason: 'Product not found' });
        continue;
      }

      if (!product.is_active) {
        validated.push({ product_id: item.product_id, valid: false, reason: 'Product inactive' });
        continue;
      }

      if (product.availability === 'sold_out' || product.stock === 0) {
        validated.push({ product_id: item.product_id, valid: false, reason: 'Sold out' });
        continue;
      }

      if (item.quantity > product.stock) {
        validated.push({
          product_id: item.product_id,
          valid: false,
          reason: `Only ${product.stock} left in stock`,
          max_quantity: product.stock,
          current_price_kobo: product.price_kobo
        });
        continue;
      }

      validated.push({
        product_id: item.product_id,
        valid: true,
        quantity: item.quantity,
        unit_price_kobo: product.price_kobo,
        line_total_kobo: product.price_kobo * item.quantity
      });
    }

    res.json({ data: validated });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== PROMO VALIDATION ==========
app.post('/api/promo/validate', async (req, res) => {
  try {
    const { code, order_total_kobo } = req.body;
    if (!code) return res.status(400).json({ error: { message: 'Promo code required' } });

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error || !promo) {
      return res.status(404).json({ error: { message: 'Invalid promo code' } });
    }

    const now = new Date().toISOString();
    if (promo.starts_at && new Date(promo.starts_at) > new Date(now)) {
      return res.status(400).json({ error: { message: 'Promo not yet active' } });
    }
    if (promo.ends_at && new Date(promo.ends_at) < new Date(now)) {
      return res.status(400).json({ error: { message: 'Promo expired' } });
    }
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return res.status(400).json({ error: { message: 'Promo usage limit reached' } });
    }
    if (order_total_kobo && order_total_kobo < promo.min_order_kobo) {
      return res.status(400).json({ error: { message: `Minimum order ${formatNaira(promo.min_order_kobo)} required` } });
    }

    res.json({ data: { code: promo.code, percent: parseFloat(promo.percent), discount_type: 'percentage' } });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== DELIVERY QUOTE ==========
app.get('/api/delivery/quote', async (req, res) => {
  try {
    const { zone_id } = req.query;
    if (!zone_id) return res.status(400).json({ error: { message: 'zone_id required' } });

    const { data: zone, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('id', zone_id)
      .eq('is_active', true)
      .single();

    if (error || !zone) {
      return res.status(404).json({ error: { message: 'Delivery zone not found' } });
    }

    res.json({ data: { zone_id: zone.id, zone_name: zone.name, fee_kobo: zone.fee_kobo, estimated_days: zone.estimated_days } });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== ORDERS ==========
// Create order (checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const { items, delivery_address, delivery_zone_id, promo_code, contact_email, contact_phone, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: { message: 'Cart items required' } });
    }
    if (!delivery_address) {
      return res.status(400).json({ error: { message: 'Delivery address required' } });
    }
    if (!delivery_zone_id) {
      return res.status(400).json({ error: { message: 'Delivery zone required' } });
    }
    if (!contact_email || !contact_phone) {
      return res.status(400).json({ error: { message: 'Contact email and phone required' } });
    }

    // Validate zone
    const { data: zone, error: zoneError } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('id', delivery_zone_id)
      .eq('is_active', true)
      .single();
    if (zoneError || !zone) {
      return res.status(400).json({ error: { message: 'Invalid delivery zone' } });
    }

    // Validate items and get fresh prices from DB
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (error || !product || !product.is_active) {
        return res.status(400).json({ error: { message: `Product unavailable: ${item.product_id}` } });
      }
      if (product.availability === 'sold_out' || product.stock === 0) {
        return res.status(400).json({ error: { message: `${product.name} is sold out` } });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({ error: { message: `Only ${product.stock} of ${product.name} available` } });
      }

      const lineTotal = product.price_kobo * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        unit_price_kobo: product.price_kobo,
        quantity: item.quantity,
        line_total_kobo: lineTotal
      });
    }

    // Apply promo
    let discount = 0;
    if (promo_code) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code.toUpperCase())
        .eq('active', true)
        .single();

      if (!promo) return res.status(400).json({ error: { message: 'Invalid promo code' } });
      if (subtotal < promo.min_order_kobo) return res.status(400).json({ error: { message: `Minimum order ${formatNaira(promo.min_order_kobo)} required` } });

      const now = new Date();
      if (promo.starts_at && new Date(promo.starts_at) > now) return res.status(400).json({ error: { message: 'Promo not yet active' } });
      if (promo.ends_at && new Date(promo.ends_at) < now) return res.status(400).json({ error: { message: 'Promo expired' } });
      if (promo.max_uses && promo.used_count >= promo.max_uses) return res.status(400).json({ error: { message: 'Promo limit reached' } });

      discount = Math.round(subtotal * (parseFloat(promo.percent) / 100));
    }

    // Get settings
    const vatRate = parseFloat(await getSetting('vat_rate', '7.5'));
    const coolerDeposit = parseInt(await getSetting('cooler_deposit_kobo', '50000'));

    // Calculate totals (server-side)
    const afterDiscount = subtotal - discount;
    const vat = calculateVAT(afterDiscount, vatRate);
    const deliveryFee = zone.fee_kobo;
    const total = afterDiscount + deliveryFee + coolerDeposit + vat;

    // Create order
    const orderNumber = 'FBS-' + Date.now().toString().slice(-6);
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        profile_id: req.headers['x-user-id'] || null,
        subtotal_kobo: subtotal,
        discount_kobo: discount,
        delivery_fee_kobo: deliveryFee,
        cooler_deposit_kobo: coolerDeposit,
        vat_kobo: vat,
        total_kobo: total,
        promo_code: promo_code || null,
        delivery_zone_id: delivery_zone_id,
        delivery_address: delivery_address,
        contact_email: contact_email,
        contact_phone: contact_phone,
        notes: notes || null,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItemsWithOrderId = orderItems.map(item => ({ ...item, order_id: order.id }));
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);
    if (itemsError) throw itemsError;

    // Increment promo used_count
    if (promo_code) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promo_code.toUpperCase())
        .single();

      if (promo) {
        await supabase
          .from('promo_codes')
          .update({ used_count: (promo.used_count || 0) + 1 })
          .eq('id', promo.id);
      }
    }

    res.status(201).json({ data: order });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Get orders for current user
app.get('/api/orders', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(404).json({ error: { message: 'Order not found' } });
  }
});

// ========== PAYMENTS ==========
// Initialize payment
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { order_id, email } = req.body;
    if (!order_id || !email) {
      return res.status(400).json({ error: { message: 'order_id and email required' } });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: { message: 'Order not found' } });
    }

    const reference = 'FBS_' + uuidv4().replace(/-/g, '').toUpperCase();
    const callbackUrl = `${process.env.FRONTEND_URL}/payment/callback?reference=${reference}`;

    const result = await initializePaystackTransaction(email, order.total_kobo, reference, callbackUrl);

    if (!result.status) {
      return res.status(400).json({ error: { message: result.message } });
    }

    // Save payment record
    const { data: payment, error: payError } = await supabase
      .from('payments')
      .insert({
        order_id: order_id,
        reference: reference,
        amount_kobo: order.total_kobo,
        status: 'pending'
      })
      .select()
      .single();

    res.json({ data: { authorization_url: result.data.authorization_url, reference, payment_id: payment.id } });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Verify payment (callback)
app.get('/api/payments/verify', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ error: { message: 'Reference required' } });

    const result = await verifyPaystackTransaction(reference);

    if (!result.status) {
      return res.status(400).json({ error: { message: result.message } });
    }

    const { data: payment, error: payError } = await supabase
      .from('payments')
      .select('*, orders(*)')
      .eq('reference', reference)
      .single();

    if (payError || !payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Verify amount matches
    if (result.data.amount !== payment.amount_kobo) {
      return res.status(400).json({ error: { message: 'Amount mismatch' } });
    }

    // Verify currency
    if (result.data.currency !== 'NGN') {
      return res.status(400).json({ error: { message: 'Currency mismatch' } });
    }

    // Update payment status
    await supabase
      .from('payments')
      .update({ status: result.data.status === 'success' ? 'success' : 'failed', raw_payload: result })
      .eq('id', payment.id);

    // If success, update order and decrement stock
    if (result.data.status === 'success') {
      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'preparing', paid_at: new Date().toISOString() })
        .eq('id', payment.order_id);

      // Decrement stock in transaction
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', payment.order_id);

      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product && product.stock >= item.quantity) {
          await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id);
        }
      }
    }

    res.json({ data: { status: result.data.status, reference, amount: result.data.amount } });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Paystack webhook
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: { message: 'Invalid signature' } });
    }

    const event = req.body;
    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      // Idempotency check
      const { data: existing } = await supabase
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .eq('status', 'success')
        .single();

      if (existing) {
        return res.status(200).json({ message: 'Already processed' });
      }

      // Update payment
      await supabase
        .from('payments')
        .update({ status: 'success', raw_payload: event })
        .eq('reference', reference);

      // Get order
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .single();

      // Update order
      await supabase
        .from('orders')
        .update({ status: 'preparing', paid_at: new Date().toISOString() })
        .eq('id', payment.order_id);

      // Decrement stock
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', payment.order_id);

      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product && product.stock >= item.quantity) {
          await supabase
            .from('products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== ADDRESSES ==========
app.get('/api/addresses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('profile_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.post('/api/addresses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const address = { ...req.body, profile_id: userId };
    const { data, error } = await supabase
      .from('addresses')
      .insert(address)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { data, error } = await supabase
      .from('addresses')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('profile_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', req.params.id)
      .eq('profile_id', userId);

    if (error) throw error;
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== CONTACT ==========
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: { message: 'Name, email, subject, and message required' } });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({ name, email, phone, subject, message })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// ========== ADMIN ROUTES ==========
// Use requireAuth + requireStaff for admin routes
app.get('/api/admin/stats', requireAuth, requireStaff, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's orders
    const { count: todayOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    // Revenue (paid orders)
    const { data: paidOrders } = await supabase
      .from('orders')
      .select('total_kobo')
      .eq('status', 'preparing')
      .gte('created_at', today);
    const revenue = paidOrders?.reduce((sum, o) => sum + parseInt(o.total_kobo), 0) || 0;

    // Pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Low stock items
    const { count: lowStock } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lte('stock', 5)
      .gt('stock', 0);

    res.json({
      data: {
        today_orders: todayOrders || 0,
        revenue_kobo: revenue,
        pending_orders: pendingOrders || 0,
        low_stock_items: lowStock || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Admin: Products CRUD
app.get('/api/admin/products', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)');
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.post('/api/admin/products', requireAuth, requireStaff, async (req, res) => {
  try {
    const product = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.put('/api/admin/products/:id', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.delete('/api/admin/products/:id', requireAuth, requireStaff, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Admin: Orders management
app.get('/api/admin/orders', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), profiles(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.put('/api/admin/orders/:id', requireAuth, requireStaff, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: { message: 'Invalid status' } });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Admin: Categories
app.get('/api/admin/categories', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.post('/api/admin/categories', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Admin: Delivery zones
app.get('/api/admin/delivery-zones', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('delivery_zones').select('*');
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.post('/api/admin/delivery-zones', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('delivery_zones').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Admin: Promo codes
app.get('/api/admin/promo-codes', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('promo_codes').select('*');
    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.post('/api/admin/promo-codes', requireAuth, requireStaff, async (req, res) => {
  try {
    const { data, error } = await supabase.from('promo_codes').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Not Found' } });
});

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

export default app;

const server = app.listen(PORT, HOST, () => {
  console.log(`Food Bite Services API running on ${HOST}:${PORT}`);
});
process.on('SIGTERM', () => server.close(() => process.exit(0)));