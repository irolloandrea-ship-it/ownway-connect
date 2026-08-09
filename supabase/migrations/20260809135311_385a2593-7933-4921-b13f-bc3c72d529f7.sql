-- 1. Leave-token columns on the signup row
ALTER TABLE public.early_access_signups
  ADD COLUMN IF NOT EXISTS leave_token_hash text,
  ADD COLUMN IF NOT EXISTS leave_token_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS leave_token_used_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS early_access_leave_token_hash_uidx
  ON public.early_access_signups (leave_token_hash)
  WHERE leave_token_hash IS NOT NULL;

-- 2. Rate-limit table (personal data: signup id + keyed HMAC of IP)
CREATE TABLE IF NOT EXISTS public.leave_link_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES public.early_access_signups(id) ON DELETE CASCADE,
  ip_hmac text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.leave_link_requests TO service_role;
ALTER TABLE public.leave_link_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leave_link_requests admin read"
  ON public.leave_link_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS leave_link_requests_signup_idx ON public.leave_link_requests (signup_id, created_at DESC);
CREATE INDEX IF NOT EXISTS leave_link_requests_ip_idx ON public.leave_link_requests (ip_hmac, created_at DESC);

-- 3. Read-only status check (safe for scanners/prefetchers)
CREATE OR REPLACE FUNCTION public.leave_token_status(p_token_hash text)
RETURNS TABLE(status text, email text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    CASE
      WHEN s.id IS NULL THEN 'invalid'
      WHEN s.leave_token_used_at IS NOT NULL THEN 'already_used'
      WHEN s.leave_token_expires_at IS NULL OR s.leave_token_expires_at < now() THEN 'expired'
      ELSE 'valid'
    END,
    s.email
  FROM (SELECT 1) x
  LEFT JOIN public.early_access_signups s ON s.leave_token_hash = p_token_hash;
$$;

-- 4. Store / rotate a leave token (also used at signup time)
CREATE OR REPLACE FUNCTION public.set_leave_token(
  p_signup_id uuid, p_token_hash text, p_expires_at timestamptz)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  UPDATE public.early_access_signups
     SET leave_token_hash = p_token_hash,
         leave_token_expires_at = p_expires_at,
         leave_token_used_at = NULL
   WHERE id = p_signup_id;
$$;

-- 5. Rate-limited leave-link request. Returns the address to mail, or nothing.
CREATE OR REPLACE FUNCTION public.request_leave_link(
  p_referral_code text, p_token_hash text, p_expires_at timestamptz, p_ip_hmac text)
RETURNS TABLE(allowed boolean, email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_signup public.early_access_signups%ROWTYPE;
  v_recent int;
  v_ip_recent int;
BEGIN
  DELETE FROM public.leave_link_requests WHERE created_at < now() - interval '24 hours';

  SELECT * INTO v_signup FROM public.early_access_signups
   WHERE referral_code = p_referral_code FOR UPDATE;

  IF p_ip_hmac IS NOT NULL THEN
    SELECT count(*) INTO v_ip_recent FROM public.leave_link_requests
     WHERE ip_hmac = p_ip_hmac AND created_at > now() - interval '1 hour';
    IF v_ip_recent >= 10 THEN
      allowed := false; RETURN NEXT; RETURN;
    END IF;
  END IF;

  IF v_signup.id IS NULL THEN
    INSERT INTO public.leave_link_requests (signup_id, ip_hmac) VALUES (NULL, p_ip_hmac);
    allowed := false; RETURN NEXT; RETURN;
  END IF;

  SELECT count(*) INTO v_recent FROM public.leave_link_requests
   WHERE signup_id = v_signup.id AND created_at > now() - interval '15 minutes';

  INSERT INTO public.leave_link_requests (signup_id, ip_hmac) VALUES (v_signup.id, p_ip_hmac);

  IF v_recent > 0 THEN
    allowed := false; RETURN NEXT; RETURN;
  END IF;

  UPDATE public.early_access_signups
     SET leave_token_hash = p_token_hash,
         leave_token_expires_at = p_expires_at,
         leave_token_used_at = NULL
   WHERE id = v_signup.id;

  allowed := true; email := v_signup.email; RETURN NEXT;
END $$;

-- 6. Atomic hard delete
CREATE OR REPLACE FUNCTION public.delete_waitlist_signup(p_token_hash text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_signup public.early_access_signups%ROWTYPE;
  v_email text;
  v_referrer uuid;
  v_count int;
BEGIN
  SELECT * INTO v_signup FROM public.early_access_signups
   WHERE leave_token_hash = p_token_hash FOR UPDATE;

  IF v_signup.id IS NULL THEN RETURN 'invalid'; END IF;
  IF v_signup.leave_token_used_at IS NOT NULL THEN RETURN 'already_used'; END IF;
  IF v_signup.leave_token_expires_at IS NULL OR v_signup.leave_token_expires_at < now() THEN
    RETURN 'expired';
  END IF;

  v_email := lower(btrim(v_signup.email));

  -- Referrer whose awarded credit came from this person
  SELECT referrer_signup_id INTO v_referrer
    FROM public.referral_credits
   WHERE referred_signup_id = v_signup.id
   LIMIT 1;

  DELETE FROM public.referral_notification_outbox
   WHERE recipient_signup_id = v_signup.id
      OR referral_credit_id IN (
        SELECT id FROM public.referral_credits
         WHERE referrer_signup_id = v_signup.id OR referred_signup_id = v_signup.id);

  DELETE FROM public.referral_credits
   WHERE referrer_signup_id = v_signup.id OR referred_signup_id = v_signup.id;

  DELETE FROM public.leave_link_requests WHERE signup_id = v_signup.id;

  DELETE FROM public.early_access_signups WHERE id = v_signup.id;

  IF v_referrer IS NOT NULL THEN
    PERFORM 1 FROM public.early_access_signups WHERE id = v_referrer FOR UPDATE;
    SELECT count(*) INTO v_count FROM public.referral_credits
     WHERE referrer_signup_id = v_referrer AND status = 'awarded';
    UPDATE public.early_access_signups
       SET referral_count = v_count WHERE id = v_referrer;
  END IF;

  -- Raw-email stores
  DELETE FROM public.email_unsubscribe_tokens WHERE lower(email) = v_email;
  DELETE FROM public.email_send_log
   WHERE lower(recipient_email) = v_email
      OR COALESCE(error_message, '') ILIKE '%' || v_email || '%'
      OR COALESCE(metadata::text, '') ILIKE '%' || v_email || '%';
  DELETE FROM public.suppressed_emails WHERE lower(email) = v_email;
  DELETE FROM public.prelaunch_analytics_events
   WHERE COALESCE(metadata::text, '') ILIKE '%' || v_email || '%';

  -- Queued, unsent email jobs
  BEGIN
    DELETE FROM pgmq.q_transactional_emails WHERE message::text ILIKE '%' || v_email || '%';
    DELETE FROM pgmq.q_auth_emails WHERE message::text ILIKE '%' || v_email || '%';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    DELETE FROM pgmq.a_transactional_emails WHERE message::text ILIKE '%' || v_email || '%';
    DELETE FROM pgmq.a_auth_emails WHERE message::text ILIKE '%' || v_email || '%';
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN 'deleted';
END $$;

-- 7. Server-only execution
REVOKE ALL ON FUNCTION public.leave_token_status(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_leave_token(uuid, text, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.request_leave_link(text, text, timestamptz, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_waitlist_signup(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.leave_token_status(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_leave_token(uuid, text, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.request_leave_link(text, text, timestamptz, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_waitlist_signup(text) TO service_role;