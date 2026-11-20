# Food Bite Services

Nigerian online food store with React, Express, Supabase, and Paystack.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Paystack account (test keys)

### 1. Supabase Setup

1. Create a new Supabase project
2. Run migrations in the SQL editor (in order):
   - `supabase/migrations/001_profiles.sql`
   - `supabase/migrations/002_categories.sql`
   - `supabase/migrations/003_products.sql`
   - `supabase/migrations/004_addresses.sql`
   - `supabase/migrations/005_delivery_zones.sql`
   - `supabase/migrations/006_settings.sql`
   - `supabase/migrations/007_promo_codes.sql`
   - `supabase/migrations/008_orders.sql`
   - `supabase/migrations/009_order_items.sql`
   - `supabase/migrations/010_payments.sql`
   - `supabase/migrations/011_testimonials.sql`
   - `supabase/migrations/012_contact_messages.sql`
   - `supabase/migrations/013_rls.sql`
   - `supabase/migrations/014_signup_trigger.sql`
   - `supabase/migrations/015_storage.sql`
3. Run seed data: `supabase/seed.sql`
4. Create storage bucket `product-images` with public read access (via Supabase dashboard)

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your Supabase and Paystack credentials
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key
npm run dev
```

### 4. Admin Dashboard Setup

```bash
cd admin
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key
npm run dev
```

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Frontend (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
```

### Admin (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=/api
```

## Testing

1. **Backend**: `curl http://localhost:3001/health`
2. **Frontend**: Open http://localhost:5173
3. **Admin**: Open http://localhost:5174 (requires admin account)

### Create an Admin Account

1. Register a new account in the frontend
2. Run this SQL in Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Features

- ✅ Product catalog with search, filters, sorting
- ✅ Cart with stock validation
- ✅ Checkout with delivery zones
- ✅ Paystack payment integration
- ✅ Order management and status tracking
- ✅ Admin dashboard
- ✅ Supabase Auth (email/password + Google OAuth)
- ✅ Row Level Security on all tables

## MVP Scope

Included:
- Homepage, catalogue, product details, cart
- Customer authentication and saved addresses
- Checkout, Paystack payment and order management
- Admin dashboard
- Supabase database, authentication and image storage

Not included:
- Loyalty points, wallet, favourites
- Customer review submission
- Live GPS delivery tracking, rider details
- PDF receipts and advanced analytics

## Design System

- Font: Plus Jakarta Sans
- Colors: Rust red (#B23A0F), warm off-white, white
- Border radius: 14px cards, 50px pills
- Tailwind CSS with custom tokens

## Deployment

### Backend (Vercel)
```bash
cd backend
vercel --prod
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

## Security

- All prices calculated server-side
- Payment verification via Paystack API
- Webhook signature verification
- Row Level Security on all tables
- Secret keys only in backend environment variables
- Never collect card details on frontend

## License

MIT