-- 1. Canonical normalized email -------------------------------------------------
DO $$
DECLARE dup_count int;
BEGIN
  SELECT count(*) INTO dup_count FROM (
    SELECT lower(btrim(email)) AS e FROM public.early_access_signups
    GROUP BY 1 HAVING count(*) > 1
  ) d;
  IF dup_count > 0 THEN
    RAISE EXCEPTION 'Cannot add unique email_normalized: % colliding groups exist', dup_count;
  END IF;
END $$;

ALTER TABLE public.early_access_signups
  ADD COLUMN email_normalized text GENERATED ALWAYS AS (lower(btrim(email))) STORED;

ALTER TABLE public.early_access_signups
  ADD CONSTRAINT early_access_signups_email_normalized_key UNIQUE (email_normalized);

DROP INDEX IF EXISTS public.early_access_signups_email_unique;

-- 2. Confirmation columns --------------------------------------------------------
ALTER TABLE public.early_access_signups
  ADD COLUMN email_verified_at timestamptz,
  ADD COLUMN confirm_token_hash text,
  ADD COLUMN confirm_token_expires_at timestamptz,
  ADD COLUMN confirm_token_used_at timestamptz;

CREATE UNIQUE INDEX early_access_signups_confirm_token_hash_key
  ON public.early_access_signups (confirm_token_hash)
  WHERE confirm_token_hash IS NOT NULL;

CREATE INDEX early_access_signups_verified_idx
  ON public.early_access_signups (priority_score, base_position, created_at)
  WHERE email_verified_at IS NOT NULL;

-- Grandfather all pre-existing signups as confirmed members.
UPDATE public.early_access_signups
  SET email_verified_at = COALESCE(email_verified_at, created_at)
  WHERE email_verified_at IS NULL;

-- 3. referral_credits ledger -----------------------------------------------------
CREATE TABLE public.referral_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_signup_id uuid NOT NULL REFERENCES public.early_access_signups(id) ON DELETE CASCADE,
  referred_signup_id uuid NOT NULL UNIQUE REFERENCES public.early_access_signups(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','awarded','void')),
  created_at timestamptz NOT NULL DEFAULT now(),
  awarded_at timestamptz
);
CREATE INDEX referral_credits_referrer_idx ON public.referral_credits (referrer_signup_id, status);

GRANT ALL ON public.referral_credits TO service_role;
GRANT SELECT ON public.referral_credits TO authenticated;
ALTER TABLE public.referral_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read referral credits" ON public.referral_credits
  FOR SELECT TO authenticated USING (public.is_admin());

-- 4. referral_notification_outbox -------------------------------------------------
CREATE TABLE public.referral_notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_credit_id uuid NOT NULL UNIQUE REFERENCES public.referral_credits(id) ON DELETE CASCADE,
  recipient_signup_id uuid NOT NULL REFERENCES public.early_access_signups(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','claimed','sent','suppressed','failed')),
  attempts int NOT NULL DEFAULT 0,
  provider_message_id text,
  provider_accepted_at timestamptz,
  claimed_at timestamptz,
  sent_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX referral_notification_outbox_status_idx
  ON public.referral_notification_outbox (status, created_at);

GRANT ALL ON public.referral_notification_outbox TO service_role;
GRANT SELECT ON public.referral_notification_outbox TO authenticated;
ALTER TABLE public.referral_notification_outbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read referral outbox" ON public.referral_notification_outbox
  FOR SELECT TO authenticated USING (public.is_admin());

-- 5. RPCs --------------------------------------------------------------------------

-- 5a. Atomic insert-or-return-existing
CREATE OR REPLACE FUNCTION public.create_or_get_signup(
  p_email text,
  p_role text,
  p_source text,
  p_referred_by text,
  p_consent_policy_version text,
  p_consent_source text,
  p_confirm_token_hash text,
  p_confirm_token_expires_at timestamptz
)
RETURNS TABLE (
  signup_id uuid,
  referral_code text,
  was_inserted boolean,
  email_verified boolean,
  confirm_token_stored boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_norm text := lower(btrim(p_email));
  v_code text;
  v_chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_referrer_id uuid;
  v_row public.early_access_signups%ROWTYPE;
  i int;
  j int;
BEGIN
  -- Resolve referrer (must exist, must be confirmed, cannot be self)
  IF p_referred_by IS NOT NULL AND p_referred_by <> '' THEN
    SELECT id INTO v_referrer_id
      FROM public.early_access_signups
     WHERE referral_code = p_referred_by
       AND email_normalized <> v_norm
     LIMIT 1;
  END IF;

  FOR i IN 1..8 LOOP
    v_code := '';
    FOR j IN 1..7 LOOP
      v_code := v_code || substr(v_chars, 1 + floor(random() * length(v_chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.early_access_signups WHERE referral_code = v_code);
  END LOOP;

  INSERT INTO public.early_access_signups (
    email, role, referral_code, referred_by, source,
    consent_to_updates, consent_marketing, consent_marketing_at,
    consent_policy_version, consent_source,
    confirm_token_hash, confirm_token_expires_at
  ) VALUES (
    btrim(p_email), p_role, v_code,
    CASE WHEN v_referrer_id IS NULL THEN NULL ELSE p_referred_by END,
    p_source,
    true, true, now(), p_consent_policy_version, p_consent_source,
    p_confirm_token_hash, p_confirm_token_expires_at
  )
  ON CONFLICT (email_normalized) DO NOTHING
  RETURNING * INTO v_row;

  IF v_row.id IS NOT NULL THEN
    -- Genuinely new signup: create the pending credit in the same transaction.
    IF v_referrer_id IS NOT NULL THEN
      INSERT INTO public.referral_credits (referrer_signup_id, referred_signup_id)
      VALUES (v_referrer_id, v_row.id)
      ON CONFLICT (referred_signup_id) DO NOTHING;
    END IF;

    signup_id := v_row.id;
    referral_code := v_row.referral_code;
    was_inserted := true;
    email_verified := false;
    confirm_token_stored := true;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Existing signup: refresh consent only. Never touch referred_by or credits.
  SELECT * INTO v_row FROM public.early_access_signups
    WHERE email_normalized = v_norm FOR UPDATE;

  UPDATE public.early_access_signups SET
    consent_to_updates = true,
    consent_marketing = true,
    consent_marketing_at = now(),
    consent_policy_version = p_consent_policy_version,
    consent_source = p_consent_source,
    -- Refresh confirmation token only while still unconfirmed.
    confirm_token_hash = CASE WHEN v_row.email_verified_at IS NULL
                              THEN p_confirm_token_hash ELSE confirm_token_hash END,
    confirm_token_expires_at = CASE WHEN v_row.email_verified_at IS NULL
                              THEN p_confirm_token_expires_at ELSE confirm_token_expires_at END,
    confirm_token_used_at = CASE WHEN v_row.email_verified_at IS NULL
                              THEN NULL ELSE confirm_token_used_at END
  WHERE id = v_row.id;

  signup_id := v_row.id;
  referral_code := v_row.referral_code;
  was_inserted := false;
  email_verified := v_row.email_verified_at IS NOT NULL;
  confirm_token_stored := v_row.email_verified_at IS NULL;
  RETURN NEXT;
END $$;

REVOKE EXECUTE ON FUNCTION public.create_or_get_signup(text,text,text,text,text,text,text,timestamptz) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_or_get_signup(text,text,text,text,text,text,text,timestamptz) TO service_role;

-- 5b. Read-only confirmation status (scanner-safe GET)
CREATE OR REPLACE FUNCTION public.confirm_email_status(p_token_hash text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN s.id IS NULL THEN 'invalid'
    WHEN s.email_verified_at IS NOT NULL THEN 'already_used'
    WHEN s.confirm_token_used_at IS NOT NULL THEN 'already_used'
    WHEN s.confirm_token_expires_at < now() THEN 'expired'
    ELSE 'valid'
  END
  FROM (SELECT 1) x
  LEFT JOIN public.early_access_signups s ON s.confirm_token_hash = p_token_hash;
$$;

REVOKE EXECUTE ON FUNCTION public.confirm_email_status(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_email_status(text) TO service_role;

-- 5c. Confirm + award (explicit POST only)
CREATE OR REPLACE FUNCTION public.confirm_email_and_award(p_token_hash text)
RETURNS TABLE (
  outcome text,
  referral_code text,
  credit_awarded boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signup public.early_access_signups%ROWTYPE;
  v_credit_id uuid;
  v_referrer_id uuid;
  v_count int;
BEGIN
  SELECT * INTO v_signup FROM public.early_access_signups
    WHERE confirm_token_hash = p_token_hash FOR UPDATE;

  IF v_signup.id IS NULL THEN
    outcome := 'invalid'; credit_awarded := false; RETURN NEXT; RETURN;
  END IF;

  IF v_signup.email_verified_at IS NOT NULL THEN
    outcome := 'already_used'; referral_code := v_signup.referral_code;
    credit_awarded := false; RETURN NEXT; RETURN;
  END IF;

  IF v_signup.confirm_token_expires_at IS NULL OR v_signup.confirm_token_expires_at < now() THEN
    outcome := 'expired'; credit_awarded := false; RETURN NEXT; RETURN;
  END IF;

  UPDATE public.early_access_signups
    SET email_verified_at = now(), confirm_token_used_at = now()
    WHERE id = v_signup.id;

  UPDATE public.referral_credits
    SET status = 'awarded', awarded_at = now()
    WHERE referred_signup_id = v_signup.id AND status = 'pending'
    RETURNING id, referrer_signup_id INTO v_credit_id, v_referrer_id;

  IF v_credit_id IS NULL THEN
    outcome := 'confirmed'; referral_code := v_signup.referral_code;
    credit_awarded := false; RETURN NEXT; RETURN;
  END IF;

  PERFORM 1 FROM public.early_access_signups WHERE id = v_referrer_id FOR UPDATE;

  SELECT count(*) INTO v_count FROM public.referral_credits
    WHERE referrer_signup_id = v_referrer_id AND status = 'awarded';

  -- Trigger recomputes priority_score = base_position - (referral_count * 5)
  UPDATE public.early_access_signups
    SET referral_count = v_count WHERE id = v_referrer_id;

  INSERT INTO public.referral_notification_outbox (referral_credit_id, recipient_signup_id)
  VALUES (v_credit_id, v_referrer_id)
  ON CONFLICT (referral_credit_id) DO NOTHING;

  outcome := 'confirmed'; referral_code := v_signup.referral_code;
  credit_awarded := true; RETURN NEXT;
END $$;

REVOKE EXECUTE ON FUNCTION public.confirm_email_and_award(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_email_and_award(text) TO service_role;

-- 5d. Claim outbox rows
CREATE OR REPLACE FUNCTION public.claim_referral_notifications(p_limit int DEFAULT 20)
RETURNS TABLE (
  outbox_id uuid,
  referral_credit_id uuid,
  recipient_signup_id uuid,
  provider_accepted_at timestamptz,
  attempts int
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH picked AS (
    SELECT o.id FROM public.referral_notification_outbox o
     WHERE o.status = 'pending'
        OR (o.status = 'claimed' AND o.claimed_at < now() - interval '10 minutes')
     ORDER BY o.created_at
     FOR UPDATE SKIP LOCKED
     LIMIT GREATEST(1, LEAST(p_limit, 100))
  )
  UPDATE public.referral_notification_outbox o
     SET status = 'claimed', claimed_at = now(), attempts = o.attempts + 1
    FROM picked
   WHERE o.id = picked.id
  RETURNING o.id, o.referral_credit_id, o.recipient_signup_id, o.provider_accepted_at, o.attempts;
END $$;

REVOKE EXECUTE ON FUNCTION public.claim_referral_notifications(int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_referral_notifications(int) TO service_role;

-- 5e. Mark outbox result
CREATE OR REPLACE FUNCTION public.mark_referral_notification(
  p_outbox_id uuid,
  p_status text,
  p_provider_message_id text DEFAULT NULL,
  p_accepted boolean DEFAULT false,
  p_error text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_status NOT IN ('pending','claimed','sent','suppressed','failed') THEN
    RAISE EXCEPTION 'invalid status %', p_status;
  END IF;
  UPDATE public.referral_notification_outbox
     SET status = p_status,
         provider_message_id = COALESCE(p_provider_message_id, provider_message_id),
         provider_accepted_at = CASE WHEN p_accepted THEN COALESCE(provider_accepted_at, now())
                                     ELSE provider_accepted_at END,
         sent_at = CASE WHEN p_status = 'sent' THEN now() ELSE sent_at END,
         last_error = p_error
   WHERE id = p_outbox_id;
END $$;

REVOKE EXECUTE ON FUNCTION public.mark_referral_notification(uuid,text,text,boolean,text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_referral_notification(uuid,text,text,boolean,text) TO service_role;

-- 6. Analytics PII removal ------------------------------------------------------
UPDATE public.prelaunch_analytics_events
   SET email = NULL, email_normalized = NULL
 WHERE email IS NOT NULL OR email_normalized IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.prelaunch_analytics_events;

ALTER TABLE public.prelaunch_analytics_events
  DROP COLUMN email,
  DROP COLUMN email_normalized;

CREATE POLICY "Anyone can insert analytics events"
  ON public.prelaunch_analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (event_name = ANY (ARRAY['page_view','cta_click','email_signup']))
    AND char_length(event_name) BETWEEN 1 AND 64
    AND (page_url IS NULL OR char_length(page_url) <= 2048)
    AND (page_path IS NULL OR char_length(page_path) <= 1024)
    AND (referrer IS NULL OR char_length(referrer) <= 2048)
    AND (button_text IS NULL OR char_length(button_text) <= 200)
    AND (button_location IS NULL OR char_length(button_location) <= 200)
    AND (source IS NULL OR char_length(source) <= 200)
    AND (utm_source IS NULL OR char_length(utm_source) <= 200)
    AND (utm_medium IS NULL OR char_length(utm_medium) <= 200)
    AND (utm_campaign IS NULL OR char_length(utm_campaign) <= 200)
    AND (utm_content IS NULL OR char_length(utm_content) <= 200)
    AND (utm_term IS NULL OR char_length(utm_term) <= 200)
  );