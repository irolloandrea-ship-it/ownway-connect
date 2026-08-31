# Complete Google Search Console setup for OwnWay

Goal: verify `https://ownway.app/` in Google Search Console and submit the sitemap so the remaining SEO finding `gsc:gsc` is resolved.

## Current state
- The only remaining failing SEO finding is `gsc:gsc`: "Google Search Console isn't fully set up."
- A Google Search Console workspace connection is already linked to this project (`Andrea's Google Search Console`).
- The verification meta tag is already present in `src/routes/__root.tsx`:
  `<meta name="google-site-verification" content="9javSE9ACLVJV2Isd6XsCxwSJ0k4fHbWHJfz-90KtDQ" />`
- The sitemap route (`src/routes/sitemap[.]xml.ts`) already points to `https://ownway.app` and lists the public pages.

## Steps to execute

1. **Request/reuse the META verification token**
   - Call the Search Console gateway to obtain (or confirm) the META token for `https://ownway.app/`.
   - If a new token is returned, update `src/routes/__root.tsx` with the exact tag; otherwise keep the existing tag.

2. **Publish the site**
   - Call `preview_ui--publish` so the verification tag goes live on `https://ownway.app/`.
   - Wait for deployment (~1 minute).

3. **Confirm the live tag**
   - Fetch `https://ownway.app/` and verify the exact `google-site-verification` meta tag is in the server-rendered HTML `<head>`.

4. **Verify ownership with Google**
   - Call the Search Console `siteVerification/v1/webResource` endpoint with the `META` method for `https://ownway.app/`.

5. **Add the verified site to the property list**
   - PUT `https://ownway.app/` to `/webmasters/v3/sites/{encoded_site_url}`.

6. **List verified properties and select the exact root URL-prefix**
   - GET `/webmasters/v3/sites`.
   - Select the exact returned `https://ownway.app/` entry.

7. **Submit the sitemap**
   - PUT `/webmasters/v3/sites/{encoded_site_url}/sitemaps/{encoded_sitemap_url}` for `https://ownway.app/sitemap.xml`.

8. **Update SEO findings**
   - Mark `gsc:gsc` as fixed with the explanation that verification, site addition, and sitemap submission are complete.

## Expected outcome
- `https://ownway.app/` is verified in Google Search Console.
- `https://ownway.app/sitemap.xml` is submitted.
- The `gsc:gsc` SEO finding is marked fixed and will be confirmed by the next scan.

## Notes
- This flow uses the already-linked workspace connection; no new connector setup is required.
- If the live tag is already present from a previous deployment, steps 2–3 can be skipped and verification can proceed immediately.
- The verification tag must match exactly between source, live HTML, and the Google token; any mismatch stops the flow until corrected.
