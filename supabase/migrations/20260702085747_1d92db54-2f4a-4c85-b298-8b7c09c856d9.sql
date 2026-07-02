CREATE TABLE public.prelaunch_analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL CHECK (event_name IN ('page_view','cta_click','email_signup')),
  page_url text,
  page_path text,
  referrer text,
  button_text text,
  button_location text,
  email text,
  email_normalized text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  source text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.prelaunch_analytics_events TO anon, authenticated;
GRANT SELECT ON public.prelaunch_analytics_events TO authenticated;
GRANT ALL ON public.prelaunch_analytics_events TO service_role;

ALTER TABLE public.prelaunch_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.prelaunch_analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read analytics events"
  ON public.prelaunch_analytics_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_prelaunch_analytics_events_created_at ON public.prelaunch_analytics_events (created_at DESC);
CREATE INDEX idx_prelaunch_analytics_events_event_name ON public.prelaunch_analytics_events (event_name);
CREATE INDEX idx_prelaunch_analytics_events_source ON public.prelaunch_analytics_events (source);