# Audit: Google Analytics 4 setup

Goal: confirm GA4 (G-BCXKVNPK87) is correctly installed, consent-compliant, and actually sending data — no feature changes unless the audit finds a defect.

## What I'll check

1. **Measurement ID wiring** — confirm `VITE_GA_MEASUREMENT_ID` is present in the environment and that the published build reads it (not just preview).
2. **Consent Mode v2** — verify the default-denied script runs before any tag loads, and that gtag.js is not fetched and no `_ga` cookies are written before consent.
3. **Grant path** — accept analytics in a real browser session and confirm gtag.js loads, `consent update` fires, and a `page_view` hit is sent to Google.
4. **Reject / revoke path** — confirm rejecting blocks all hits and clears GA cookies.
5. **Events** — confirm `page_view` (including SPA route changes), `waitlist_form_viewed`, `waitlist_form_submitted`, `interest_selected`, `consent_accepted`, `consent_rejected` all fire with correct params.
6. **Privacy** — confirm no email addresses, query strings, or tokens are ever sent; token routes (`/leave-waitlist`, `/confirm-email`) stay excluded.
7. **Live site** — verify the same behaviour on the published domain, not only in preview.

## How

Run a headless browser against the running app, intercept network requests to `googletagmanager.com` / `google-analytics.com`, and record which hits fire before and after consent. Repeat the key checks against the published site.

## Output

A short report: what passes, what fails, and — if anything fails — the specific fix I'd apply next (I'll ask before changing code).
