
CREATE TABLE public.early_access_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('explorer','waymaker','curious')),
  destination TEXT,
  source TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX early_access_signups_email_role_key ON public.early_access_signups (lower(email), role);

GRANT ALL ON public.early_access_signups TO service_role;
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view signups"
  ON public.early_access_signups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
