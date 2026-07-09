-- 1) prelaunch_analytics_events: constrain INSERT WITH CHECK
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.prelaunch_analytics_events;
CREATE POLICY "Anyone can insert analytics events"
ON public.prelaunch_analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_name IN ('page_view','cta_click','email_signup')
  AND char_length(event_name) BETWEEN 1 AND 64
  AND (email IS NULL OR (
    char_length(email) <= 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ))
  AND (email_normalized IS NULL OR char_length(email_normalized) <= 254)
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

-- 2) trip_feedback: add scoped public SELECT for approved testimonials
DROP POLICY IF EXISTS "public read approved testimonials" ON public.trip_feedback;
CREATE POLICY "public read approved testimonials"
ON public.trip_feedback
FOR SELECT
TO anon, authenticated
USING (
  public_review_permission = true
  AND admin_review_status = 'approved'
);

GRANT SELECT ON public.trip_feedback TO anon;