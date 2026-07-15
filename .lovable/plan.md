## Goal

Replace the `ExpandingCards` block on `/plan-a-trip` and `/become-a-waymaker` with a floating carousel that shows one card at a time, with previous/next cards peeking at the sides.

## Behavior

- **Auto-advance**: rotates every ~6s. Pauses on hover, focus-within, when the tab is hidden, or when the user interacts (arrow/dot/swipe).
- **Manual controls**: left/right arrow buttons, clickable dot indicators, swipe on touch, and ←/→ keys when the carousel is focused.
- **Accessibility**: `aria-roledescription="carousel"`, live region announces "Slide X of Y", buttons have `aria-label`s, respects `prefers-reduced-motion` (crossfade instead of slide, no auto-advance).
- **Loop**: wraps around at both ends.

## Visual

- Active card centered, larger, full opacity, soft floating shadow.
- Previous/next cards peek on the sides at ~85% scale and ~40% opacity, non-interactive.
- Smooth spring/ease transition (~500ms) between slides. Reuses existing card styling (rounded-3xl, border, bg-card, shadow-card, accent eyebrow, icon chip, serif title).

## Content

Keep the 4 existing cards per page but simplify each so a single card feels lighter:
- Keep eyebrow, title, icon.
- Shorten description to 1–2 sentences.
- Trim bullets to max 3 short items.
- Copy edits happen in the two route files only; no meaning changes.

## Files

- **New** `src/components/ui/floating-carousel.tsx` — reusable component. Props: `items: { id, eyebrow, title, description, bullets, icon }[]`, optional `autoAdvanceMs` (default 6000). Handles peek layout, controls, a11y, reduced motion, pause-on-interact. Uses `framer-motion` (already in the project via `JourneyMockup`).
- **Edit** `src/routes/plan-a-trip.tsx` — swap `ExpandingCards` import + usage for `FloatingCarousel`; trim card copy.
- **Edit** `src/routes/become-a-waymaker.tsx` — same swap and copy trim.
- Leave `src/components/ui/expanding-cards.tsx` in place (unused, no other imports) — safe to remove later if desired.

## Out of scope

Page headers, hero, email capture, footer, header, and all other sections stay untouched.
