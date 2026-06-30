
-- Lock down early_access_signups writes: no anon/authenticated INSERT/UPDATE; only service-role bypass.
REVOKE INSERT, UPDATE, DELETE ON public.early_access_signups FROM anon, authenticated;

-- Restrict waymaker_destinations public read to verified rows only.
DROP POLICY IF EXISTS "anyone read destinations" ON public.waymaker_destinations;
CREATE POLICY "verified destinations readable" ON public.waymaker_destinations
  FOR SELECT TO anon, authenticated
  USING (is_verified = true);
CREATE POLICY "admins read all destinations" ON public.waymaker_destinations
  FOR SELECT TO authenticated
  USING (is_admin());
