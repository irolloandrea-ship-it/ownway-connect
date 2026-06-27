
-- 1. Drop overly permissive anon INSERT policies (server functions use service role to write)
DROP POLICY IF EXISTS "anon can insert trip" ON public.explorer_trip_requests;
DROP POLICY IF EXISTS "anon insert feedback" ON public.trip_feedback;
DROP POLICY IF EXISTS "anon insert destinations" ON public.waymaker_destinations;

-- 2. Convert SECURITY DEFINER helpers to SECURITY INVOKER.
--    is_admin only reads the caller's own user_roles row, which the
--    "users see own roles" policy already permits.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Lock execute privileges to authenticated only (RLS policies need it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
