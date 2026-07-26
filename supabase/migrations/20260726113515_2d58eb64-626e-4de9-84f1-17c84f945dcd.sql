
ALTER TABLE public.early_access_signups
  ADD COLUMN IF NOT EXISTS consent_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_marketing_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_policy_version text,
  ADD COLUMN IF NOT EXISTS consent_source text;
