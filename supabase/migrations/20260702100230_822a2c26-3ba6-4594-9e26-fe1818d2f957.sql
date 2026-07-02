DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.prelaunch_analytics_events;
CREATE POLICY "Anyone can insert analytics events"
ON public.prelaunch_analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_name IN ('page_view','cta_click','email_signup')
  AND char_length(event_name) BETWEEN 1 AND 64
);