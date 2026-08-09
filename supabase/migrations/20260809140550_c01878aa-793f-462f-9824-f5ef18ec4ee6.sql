CREATE OR REPLACE FUNCTION public.create_or_get_signup(p_email text, p_role text, p_source text, p_referred_by text, p_consent_policy_version text, p_consent_source text, p_confirm_token_hash text, p_confirm_token_expires_at timestamp with time zone)
 RETURNS TABLE(signup_id uuid, referral_code text, was_inserted boolean, email_verified boolean, confirm_token_stored boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_norm text := lower(btrim(p_email));
  v_code text;
  v_chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_referrer_id uuid;
  v_row public.early_access_signups%ROWTYPE;
  i int;
  j int;
BEGIN
  -- Resolve referrer (must exist, cannot be self)
  IF p_referred_by IS NOT NULL AND p_referred_by <> '' THEN
    SELECT s.id INTO v_referrer_id
      FROM public.early_access_signups s
     WHERE s.referral_code = p_referred_by
       AND s.email_normalized <> v_norm
     LIMIT 1;
  END IF;

  FOR i IN 1..8 LOOP
    v_code := '';
    FOR j IN 1..7 LOOP
      v_code := v_code || substr(v_chars, 1 + floor(random() * length(v_chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.early_access_signups s WHERE s.referral_code = v_code
    );
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

  SELECT * INTO v_row FROM public.early_access_signups s
    WHERE s.email_normalized = v_norm FOR UPDATE;

  UPDATE public.early_access_signups SET
    consent_to_updates = true,
    consent_marketing = true,
    consent_marketing_at = now(),
    consent_policy_version = p_consent_policy_version,
    consent_source = p_consent_source,
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
END $function$;

REVOKE ALL ON FUNCTION public.create_or_get_signup(text, text, text, text, text, text, text, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_or_get_signup(text, text, text, text, text, text, text, timestamptz) TO service_role;