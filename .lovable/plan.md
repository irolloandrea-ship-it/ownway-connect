# OwnWay landing page redesign (in place)

Redesign the public Home page for campaign traffic. No routes, backend, waitlist, consent, analytics, legal or cookie behaviour change. The existing iPhone journey preview stays exactly as it is functionally.

## Hero

New copy, replacing the current hero:

- Eyebrow: "For curious travellers & locals"
- Headline: "Travel deeper with someone who knows the place."
- Support: "Real connections. Local knowledge. More meaning in every trip."
- CTA: "Join early access" (opens the existing early-access dialog — same trigger, same `#join` deep-link behaviour)
- Note under CTA: "Starting city by city."

Layout: 55/45 on desktop (copy left, visual composition right), stacked on mobile with a full-width 48px-tall CTA, two-column on tablet.

Hero image: one new photoreal editorial image generated to the brief supplied (two adults in quiet conversation on a sunlit Florence street, warm late-afternoon light, calm space on the left edge, no text/logos/crowds). Stored as a CDN asset pointer in `src/assets/` — no external URLs. It is meaningful editorial content, so it gets concise descriptive alt text, not `alt=""`. Delivered responsively and compressed, with the aspect ratio reserved in CSS so it causes no layout shift on a mobile campaign visit.

Desktop hero composition: the real `OwnWayPhoneCarousel` component sits inside the hero's right-hand visual, overlapping the Florence image as in the reference. It is the live component — not a screenshot or simplified phone card — with its frame, Traveller/WayMaker switch, screens, arrows, dots, auto-advance, swipe and aria labels intact. On tablet and mobile the same single instance moves below the hero copy for readability. The page renders exactly one phone preview; there is no second duplicate later on.

## Page order

1. Hero (with the phone carousel in the desktop visual composition)
2. How it works (compact, three steps, small line icons)
3. Proof card
4. Two audience cards
5. FAQ
6. Footer

How it works copy: "Tell us about your trip" / "We match you with someone who knows the place" / "Chat, get advice, and travel with confidence".

Proof card: white card, labelled "An example of the kind of local advice you could receive". Question "Where should I eat on a quiet Tuesday?", answer "Try a small local trattoria after 8pm, when the neighbourhood comes alive." It is explicitly an illustrative example — no invented WayMaker identity, customer, review, rating, testimonial or claim of a real interaction.

## Early-access modal

Functionality untouched: same email field, validation, `submitEarlyAccess` call, role values (`explorer` / `waymaker`), consent checkbox (unchecked by default), Privacy Policy link, referral capture, analytics events.

Only the role control changes: the two small pill radios become two large selectable cards, still a `radiogroup` with `aria-checked`, keyboard operable, coral/green selected state.

- "Planning a trip" — "Get advice that fits your journey." (value `explorer`)
- "Know this city" — "Help travellers experience it more deeply." (value `waymaker`)

Presentation: bottom sheet on mobile (rounded top, anchored to the bottom, scrollable so email + consent stay visible), centred dialog on desktop.

## Phone preview — preserved

`OwnWayPhoneCarousel` keeps its frame, both journey screen sets, the Traveller/WayMaker switch (Traveller default, switch stays outside the phone), arrows, dots, active-screen logic, auto-advance, swipe and aria labels. Only the surrounding section — heading, spacing, background band, responsive framing — is restyled, plus a subtle fade on role change.

## Header

Desktop unchanged. Mobile gains a menu button opening a slide-in sheet with Home, Find a WayMaker, Become a WayMaker and a "Join early access" action.

## Visual system

Tokens in `src/styles.css` are nudged to the stated palette: background `#FFF8F0`, primary/ink deep forest green `#163428`, sand surface `#E9D8C6`, white cards, coral `#F26C4F` reserved for small accents. Serif display + sans body stay as-is. No dark mode work, no gradients or glass.

## Technical notes

- Files touched: `src/routes/index.tsx`, `src/components/JoinEarlyAccess.tsx`, `src/components/SiteHeader.tsx`, `src/styles.css`, a new `src/components/ui/proof-card.tsx`, and section wrappers around `ownway-phone-carousel.tsx` (component internals unchanged apart from the fade on role switch).
- New generated hero asset added as `src/assets/hero-florence.jpg.asset.json`.
- Not touched: server functions, Supabase, cookie-consent module, analytics config, legal routes, other pages.
- Transitions kept in the 150–220ms range and gated behind `prefers-reduced-motion`.

## Verification

Playwright passes at 390px, 834px and 1440px: hero fits as a first screen, CTA opens the dialog, role cards select and submit the existing values, email + consent validation still block submission, Privacy and Cookie Settings links resolve, rejecting analytics still loads no GA4, both preview journeys render without clipping, no horizontal overflow and no console errors. Production build must pass.
