-- +go migrate Up
-- Close promo_codes to anon AND to authenticated customers.
-- Only admins/staff (and the backend service role) may read promo_codes.
-- Frontend now uses POST /api/promo/validate and GET /api/promo/active via the backend.

-- Remove the broad "any authenticated user can read promo codes" policy
DROP POLICY IF EXISTS "Promo codes are viewable by authenticated" ON promo_codes;

-- Keep admin/staff management policy (admin = existing; staff via requireStaff in API)
-- Ensure only admin role can read via anon/authenticated client:
CREATE POLICY "Promo codes are viewable by admins" ON promo_codes
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Grant SELECT to anon is NOT granted (anon cannot read). Confirm:
REVOKE SELECT ON promo_codes FROM anon;
REVOKE SELECT ON promo_codes FROM authenticated;

-- Admin/staff access goes through the service role (backend), which bypasses RLS.
-- This migration closes direct client reads so codes can never be enumerated publicly.