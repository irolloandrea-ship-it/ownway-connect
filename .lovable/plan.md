# SEO / Search Console check for ownway.app (read-only report)

No changes were made. Everything below comes from live requests to the production site.

## Correctly configured

- **Canonical on the live homepage**: `<link rel="canonical" href="https://ownway.app/"/>` is present in the server-rendered `<head>`.
- **og:url**: `<meta property="og:url" content="https://ownway.app/"/>` is present.
- **Redirects** — no duplicate host is publicly serving content:
  - `http://ownway.app/` → 301 → `https://ownway.app/`
  - `https://www.ownway.app/` → 302 → `https://ownway.app/`
  - `https://ownway-connect.lovable.app/` → 302 → `https://ownway.app/` (including `/robots.txt`)
  - The preview URL (`id-preview--…lovable.app`) requires Lovable login (302 to auth), so it is not crawlable.
- **robots.txt**: `User-agent: * / Allow: /` — nothing blocks indexing.
- **Metadata**: no `noindex` on the homepage; no `X-Robots-Tag` header on any checked URL.
- **Sitemap**: `https://ownway.app/sitemap.xml` returns 6 URLs, all on `https://ownway.app`, no preview or Lovable URLs. It is generated from `src/routes/sitemap[.]xml.ts` with `BASE_URL = "https://ownway.app"`.
- Google Search Console: the `https://ownway.app/` URL-prefix property is verified and the sitemap has been submitted.

## Missing or incorrect

1. **robots.txt uses a relative `Sitemap:` directive** — `Sitemap: /sitemap.xml`. The sitemaps spec requires a full absolute URL; Google may ignore this line. Minor, since the sitemap is already submitted directly and lives at the well-known path.
2. **`www` and the Lovable domain redirect with 302 (temporary), not 301 (permanent).** Google still consolidates 302s, but more slowly and less definitively than a 301. This is hosting-level behaviour, not something in the app code.

Nothing else is preventing `https://ownway.app/` from being indexed.

## Likely cause of "Duplicate without user-selected canonical"

Google crawled `https://ownway-connect.lovable.app/` while it was still serving the site directly — before the custom domain was connected and made primary, and before the current canonical tag existed. That URL is now redirecting to `https://ownway.app/`, but Search Console keeps reporting the historical state until Google re-crawls the Lovable URL, which can take days to weeks. Because the Lovable URL now returns a redirect rather than a page, this is expected to resolve itself with no further action.

Supporting evidence: at the time of this check the Lovable URL serves no HTML at all, so there is no longer any duplicate page for Google to compare against.

## Recommended fix (nothing urgent)

1. **Wait for re-crawl.** The redirect + self-referencing canonical is exactly the configuration Google needs. No code change would speed this up.
2. Optional, in Lovable: make `robots.txt` use the absolute sitemap URL — `Sitemap: https://ownway.app/sitemap.xml`. One-line change to `public/robots.txt`.
3. Optional, in Search Console: use URL Inspection on `https://ownway-connect.lovable.app/` and request indexing/re-crawl so Google sees the redirect sooner.

## Requires manual action outside Lovable

- **Confirm `ownway.app` is set as the primary domain** in Project Settings → Domains (the redirects suggest it already is; the setting is what makes every other host redirect to it). This is the hosting/domain setting that makes ownway.app the only indexable production domain.
- **301 vs 302** on the `www` and `*.lovable.app` redirects is controlled by Lovable hosting and cannot be changed from project code.
- **Requesting re-crawl** of the Lovable URL must be done by you in the Search Console UI; the API cannot request indexing.

Say the word and I'll apply the robots.txt line; otherwise no change is needed.
