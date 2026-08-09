-- 1. Durable provenance record
DO $$ BEGIN
  CREATE TYPE public.membership_provenance AS ENUM ('legacy_grandfathered', 'email_link_confirmed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.early_access_signups
  ADD COLUMN IF NOT EXISTS membership_provenance public.membership_provenance;

-- Existing verified rows were grandfathered in, not verified by email link.
UPDATE public.early_access_signups
   SET membership_provenance = 'legacy_grandfathered'
 WHERE membership_provenance IS NULL
   AND email_verified_at IS NOT NULL;

-- 2. Canonical queue ordering, used everywhere:
--    priority_score ASC, base_position ASC NULLS LAST, created_at ASC, id ASC
CREATE OR REPLACE FUNCTION public.waitlist_position(p_signup_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH me AS (
    SELECT priority_score, base_position, created_at, id, email_verified_at
      FROM public.early_access_signups WHERE id = p_signup_id
  )
  SELECT CASE WHEN (SELECT email_verified_at FROM me) IS NULL THEN 0 ELSE (
    SELECT 1 + count(*)
      FROM public.early_access_signups s, me
     WHERE s.email_verified_at IS NOT NULL
       AND (
         COALESCE(s.priority_score, 0), (s.base_position IS NULL), COALESCE(s.base_position, 0), s.created_at, s.id
       ) < (
         COALESCE(me.priority_score, 0), (me.base_position IS NULL), COALESCE(me.base_position, 0), me.created_at, me.id
       )
  ) END;
$$;

REVOKE ALL ON FUNCTION public.waitlist_position(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.waitlist_position(uuid) TO service_role;

-- 3. Record provenance on email-link confirmation
CREATE OR REPLACE FUNCTION public.confirm_email_and_award(p_token_hash text)
 RETURNS TABLE(outcome text, referral_code text, credit_awarded boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    SET email_verified_at = now(),
        confirm_token_used_at = now(),
        membership_provenance = 'email_link_confirmed'
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

  UPDATE public.early_access_signups
    SET referral_count = v_count WHERE id = v_referrer_id;

  INSERT INTO public.referral_notification_outbox (referral_credit_id, recipient_signup_id)
  VALUES (v_credit_id, v_referrer_id)
  ON CONFLICT (referral_credit_id) DO NOTHING;

  outcome := 'confirmed'; referral_code := v_signup.referral_code;
  credit_awarded := true; RETURN NEXT;
END $function$;