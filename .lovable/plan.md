## OwnWay — Concierge MVP Plan

A warm, trustworthy travel-matching web app. Brand inspired by the uploaded logo (two overlapping circles: deep black/charcoal + warm gold, on soft cream background, elegant light serif/sans typography).

### Design system (built first in `src/styles.css`)
- Palette: cream background `#FCFBF8`, ink `#1A1A1A`, gold accent `#B89B5E`, muted warm gray. All as `oklch` semantic tokens.
- Typography: elegant display (Cormorant / Instrument Serif feel for headings) + clean sans (Work Sans / Inter alt) for body. Loaded via `<link>` in `__root.tsx`.
- Components: rounded-2xl cards, subtle shadows, generous whitespace, calm transitions. Custom shadcn variants — no ad-hoc color classes.
- Reusable OwnWay logo component (two overlapping circles in SVG).

### Backend (Lovable Cloud / Supabase)
Enable Cloud and create migrations for all 7 tables exactly as specified:
`explorer_trip_requests`, `waymaker_applications`, `waymaker_destinations`, `waymaker_profiles`, `matched_waymakers`, `city_feed_posts`, `trip_feedback` — each with GRANTs, RLS, and policies.

Access model:
- Explorer trip requests: anonymous insert allowed (consent-gated form); read via `private_trip_space_token` only (server function lookup, no broad SELECT).
- WayMaker applications: anonymous insert; read restricted.
- WayMaker public profiles: `TO anon` SELECT only where `is_public = true`, safe columns.
- City feed: `TO anon` SELECT where `status = 'approved'`.
- Admin: `user_roles` table + `has_role()` security-definer function; admin role grants full access via policies.
- Feedback: insert via trip token; admin reads.

Server functions (`src/lib/*.functions.ts`) for: submit trip, submit waymaker app, fetch trip space by token, submit feedback, admin actions (approve waymaker, assign matches, moderate feed, etc.). Admin functions use `requireSupabaseAuth` + `has_role` check.

### Pages (TanStack routes)
1. `/` — Landing (hero with logo + matching visual, problem, insight, how-it-works, who-for, CTA).
2. `/trip/new` — Explorer trip setup, 6-step slide wizard with framer-motion horizontal slide.
3. `/trip/confirmation/:token` — Match-pending confirmation card.
4. `/waymaker/apply` — WayMaker application, 5-step slide wizard.
5. `/waymaker/:id` — Public WayMaker profile + "Request this WayMaker" form.
6. `/feed` — City feed with city selector + category filters (kept intentionally lightweight).
7. `/trip/:token` — Explorer private Trip Space (summary, status, suggested WayMakers, admin note, feedback CTA).
8. `/trip/:token/feedback` — Feedback page with separate MatchScore (internal) and WayScore (public) sections.
9. `/auth` — Admin sign-in (email/password).
10. `/_authenticated/admin` — Admin panel with 6 tabs: Trip Requests, WayMaker Apps, Matching Workspace, City Feed Moderation, Feedback & Scores, Analytics.

### Slide wizard
Reusable `<StepWizard>` component: framer-motion horizontal slide, Back/Continue, "Step X of N" indicator, autosaves to local state per step, submits at final step. Used by trip setup and waymaker application.

### Matching prompt packet
Pure function that turns a trip request row into a clean paragraph. Stored as computed `matching_prompt_packet` text column populated on insert. Admin can "Copy prompt packet" in the matching workspace.

### Scope discipline
- City feed stays a thin moderated list — no comments, follows, or social features.
- No AI calls wired in MVP (prompt packet is just text for copy/paste).
- No payments, chat, video, or auto-matching. "Premium coming soon" badges where relevant.
- Soft email-only Explorer access via private token URL (no Explorer accounts). Only WayMaker admins/founder use real auth.

### Technical notes
- TanStack Start + Query + Cloud (Supabase).
- All forms validated with Zod via server function `inputValidator`.
- Admin role created via SQL seed; founder grants self admin manually after first sign-up (documented in README).
- SEO: per-route `head()` titles + descriptions, sitemap.xml + robots.txt.

### Build order
1. Enable Lovable Cloud.
2. Design tokens + logo + fonts.
3. Migrations (all tables + RLS + role).
4. Server functions.
5. Landing page.
6. Step wizard + Explorer trip flow + confirmation + trip space.
7. WayMaker application + public profile.
8. City feed (view).
9. Feedback page.
10. Auth + Admin panel (all 6 tabs).
11. Sitemap/robots + final polish.
