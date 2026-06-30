
-- Drop old composite uniqueness; email must now be globally unique
ALTER TABLE public.early_access_signups DROP CONSTRAINT IF EXISTS early_access_signups_email_role_key;
DROP INDEX IF EXISTS public.early_access_signups_email_role_key;

-- Allow new 'unknown' role and relax NOT NULL via default
ALTER TABLE public.early_access_signups DROP CONSTRAINT IF EXISTS early_access_signups_role_check;
ALTER TABLE public.early_access_signups
  ALTER COLUMN role SET DEFAULT 'unknown',
  ADD CONSTRAINT early_access_signups_role_check
    CHECK (role IN ('explorer','waymaker','curious','unknown'));

-- New columns
ALTER TABLE public.early_access_signups
  ADD COLUMN IF NOT EXISTS referral_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS base_position integer,
  ADD COLUMN IF NOT EXISTS priority_score integer,
  ADD COLUMN IF NOT EXISTS consent_to_updates boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique email (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS early_access_signups_email_unique
  ON public.early_access_signups (lower(email));

-- Backfill base_position by signup order
WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at, id) AS rn
  FROM public.early_access_signups
)
UPDATE public.early_access_signups s
SET base_position = ranked.rn,
    priority_score = ranked.rn - (s.referral_count * 5)
FROM ranked
WHERE s.id = ranked.id AND (s.base_position IS NULL OR s.priority_score IS NULL);

-- Sequence to assign base_position on insert
CREATE SEQUENCE IF NOT EXISTS public.early_access_position_seq;
SELECT setval('public.early_access_position_seq',
              GREATEST(COALESCE((SELECT MAX(base_position) FROM public.early_access_signups), 0), 1));

CREATE OR REPLACE FUNCTION public.early_access_before_insert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.base_position IS NULL THEN
    NEW.base_position := nextval('public.early_access_position_seq');
  END IF;
  NEW.priority_score := NEW.base_position - (COALESCE(NEW.referral_count,0) * 5);
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS early_access_before_insert ON public.early_access_signups;
CREATE TRIGGER early_access_before_insert
  BEFORE INSERT ON public.early_access_signups
  FOR EACH ROW EXECUTE FUNCTION public.early_access_before_insert();

CREATE OR REPLACE FUNCTION public.early_access_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.priority_score := COALESCE(NEW.base_position,0) - (COALESCE(NEW.referral_count,0) * 5);
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS early_access_before_update ON public.early_access_signups;
CREATE TRIGGER early_access_before_update
  BEFORE UPDATE ON public.early_access_signups
  FOR EACH ROW EXECUTE FUNCTION public.early_access_before_update();
