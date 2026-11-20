# Product Requirements Document (PRD)

## Food Bite Services: Online Food Store

**Project Type:** Small-scale food e-commerce website
**Technology Stack:** React + Node/Express + Supabase (see `guide.md`)
**Version:** 1.1

## 1. Project Overview

A responsive website for marketing and selling Nigerian food products online. Customers can browse available food items, view product details, add items to a cart, pay online and track order status. Administrators can manage products, stock and orders.

## 2. Project Objectives

- Showcase food products with images, descriptions, prices and availability.
- Make it easy for customers to order food online.
- Provide secure online payment through Paystack.
- Enable administrators to manage products, stock and orders.
- Deliver a fast, mobile-friendly user experience.

## 3. Target Users

- **Customers:** Browse food products and place orders.
- **Administrators:** Manage products, inventory and customer orders.

## 4. Core Features

### Customer Features

- Homepage with promotional banners, categories and featured food items.
- Food catalogue with categories, search, filters, sorting and pagination.
- Product details: images, price, description, rating (display only) and availability (In stock, Low stock, Sold out).
- Shopping cart with quantity management and stock warnings.
- Customer registration and login (email/password and Google through Supabase Auth).
- Checkout with delivery address and delivery zone fee.
- Promo code support.
- Online payment through Paystack only.
- Order confirmation, order history and order status timeline.
- Saved delivery addresses.
- About Us and Contact pages with business information.
- Custom 404 page.

### Admin Features

- Secure admin login with role check.
- Add, edit and delete food products.
- Upload and manage product images.
- Manage categories, prices, delivery zones and promo codes.
- Update product availability and stock.
- View and manage customer orders.
- Update order status: Pending, Preparing, On the way, Delivered, Cancelled.
- Dashboard stats: today's orders, revenue, pending orders, low-stock items.

## 5. Technology Stack

See `guide.md`. Summary: React (Vite) + Tailwind CSS, Node.js + Express, Supabase (PostgreSQL, Auth, Storage), Paystack, Vercel, Git + GitHub.

## 6. Main Pages

1. Home
2. Shop / Food Catalogue
3. Product Details
4. Shopping Cart
5. Checkout
6. Payment Callback (verification and confirmation)
7. Login / Register
8. My Account (My Orders, Addresses)
9. About Us
10. Contact Us
11. 404 Not Found
12. Admin Dashboard (separate app)

## 7. Basic User Flow

1. Customer visits the website.
2. Customer browses or searches for food.
3. Customer adds products to the cart.
4. Customer proceeds to checkout and logs in or registers.
5. Customer enters contact and delivery details.
6. Server calculates the total from database prices and creates a pending order.
7. Customer pays through Paystack's hosted checkout.
8. Server verifies the payment, marks the order paid and reduces stock.
9. Customer sees confirmation and can follow the order status.
10. Administrator processes the order and updates its status.

## 8. Design Requirements

- Follow `design/DESIGN.md` and the Stitch HTML/screenshots in `design/`.
- Clean, modern, food-focused design. Warm off-white background, deep rust red (#B23A0F) primary colour, Plus Jakarta Sans font.
- Prices in Naira, formatted like ₦12,500.
- Responsive layout for mobile, tablet and desktop.
- Clear In stock, Low stock and Sold out states.
- Fast-loading pages and optimised images.

## 9. Security Requirements

- Secure authentication and role-based access.
- Supabase Row Level Security (RLS) on every table.
- Server calculates all prices, discounts, delivery fees and totals. Never trust values from the browser.
- Payments are verified with Paystack (status, amount, currency) before an order is marked paid.
- Paystack webhook verifies the `x-paystack-signature` header and is idempotent.
- Card details never touch our frontend or backend.
- Secret keys stay in backend environment variables only.
- Input validation, rate limiting, helmet and CORS on the API.
- Restrict product management to authorised administrators.

## 10. MVP Scope

Included:

- Homepage, catalogue, product details, cart.
- Customer authentication and saved addresses.
- Checkout, Paystack payment and order management.
- Admin dashboard.
- Supabase database, authentication and image storage.

Not in the MVP (later): loyalty points, wallet, favourites, customer review submission, live GPS delivery tracking, rider details, PDF receipts and advanced analytics.

## 11. Success Criteria

- Customers can browse products and place orders successfully.
- Payments are verified before orders are marked as paid.
- Administrators can manage products and orders.
- The website works across mobile and desktop devices.
- Customer and order data are protected.

## 12. Project Deliverable

A functional, responsive food-selling website with a customer storefront, an admin dashboard, and Supabase-powered database, authentication and image storage, deployed on Vercel.
