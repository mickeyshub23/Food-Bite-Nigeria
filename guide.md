# Build Guide: Food Bite Services

Read `PRD.md` first for the requirements. This file lists the tools to use. If `PRD.md` and this file disagree, this file wins.

## Stack

| Component | Technology |
| --- | --- |
| Programming language | JavaScript (no TypeScript) |
| Frontend (storefront) | React.js (Vite) |
| UI styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | Supabase PostgreSQL (create migration files) |
| Authentication | Supabase Auth |
| Image storage | Supabase Storage (bucket) |
| API / data access | Supabase Client SDK |
| Admin dashboard | React.js (separate app) |
| Payment integration | Paystack only |
| Hosting | Vercel |
| Version control | Git + GitHub |

## Brand

"Food Bite Services". Do not use any other brand name.

## Project folders

```
Food Bite Nigeria/
├── PRD.md
├── guide.md
├── design/        (DESIGN.md, Stitch HTML files, screenshots)
├── frontend/
├── admin/
├── backend/
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── README.md
```

## UI

- Source of truth: `design/DESIGN.md`.
- Visual reference: the Stitch HTML files and screenshots in `design/` (Home, Shop, About, Cart, Account/Orders, Payment).
- Put the design tokens (colours, fonts, spacing, radii) into `tailwind.config.js`. Do not use the Tailwind CDN script.
- Build reusable components: Button, Card, ProductCard, StatusBadge, CategoryChip, QuantityStepper, Header, Footer, Toast, EmptyState, Skeleton.
- Do not hotlink the Stitch image URLs. Use images from Supabase Storage.

## Rules that must not be broken

1. React, not Vue.
2. Paystack only. No Flutterwave or bank-transfer options.
3. Never collect card numbers, expiry or CVV on our site. Redirect to Paystack's hosted checkout.
4. The server calculates all prices and totals from the database.
5. Verify every payment with Paystack and verify the webhook signature before marking an order paid.
6. Reduce stock only after confirmed payment.
7. Enable Row Level Security on every table.
8. Secret keys only in backend environment variables. Commit only `.env.example` files.
9. Build only what the PRD's MVP lists.

## How to work

Build in phases and stop after each one so it can be tested:

1. Supabase migrations and seed data
2. Backend API
3. Frontend shell, design system, Home, Shop, Product
4. Cart, checkout and Paystack
5. Auth, account, orders, About, Contact, 404
6. Admin dashboard
7. README and Vercel deployment

After each phase, explain how to run and test it, then commit to git.
