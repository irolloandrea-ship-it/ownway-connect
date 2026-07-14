## Scope

Replace only the `#how-it-works` section in `src/routes/index.tsx` with a new interactive flip-card component. No other section, style, or route changes.

## New component

Create `src/components/HowItWorksFlipCards.tsx`:

- Renders the section wrapper (eyebrow "How OwnWay works" + existing headline) and a responsive grid of 3 `FlipCard` items.
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with the third card centering on tablet, generous gap.
- Each `FlipCard` is a client component with:
  - Outer wrapper: fixed aspect (`aspect-[4/5]` or `min-h-[360px]`) with `perspective: 1200px`, so layout never shifts.
  - Inner: `transform-style: preserve-3d`, `transition-transform duration-[600ms] ease-in-out`, rotates `rotateY(180deg)` when flipped.
  - Front + back: absolutely positioned, `backface-visibility: hidden`, back pre-rotated `rotateY(180deg)`. Both use `card-warm` styling (white card, rounded-3xl, soft shadow).
  - Front layout: top step number (`STEP 01` in accent uppercase tracked), centered large icon (~size 56–64, `text-accent`, in a soft accent-tinted circle), bottom title (`font-display text-2xl`), small caption "Hover or tap to discover" in muted.
  - Back layout: small icon top, title, body paragraph. Card 2's body highlights "Personally reviewed by our team." with `text-accent font-medium` inline emphasis.
- Interaction:
  - Rendered as `<button type="button">` (native focusability + keyboard). Enter/Space toggles flipped state.
  - Desktop: also flips on `onMouseEnter` / `onMouseLeave` (hover). Hover adds subtle lift (`-translate-y-1`) and stronger shadow before/through the flip.
  - Mobile/touch: tap toggles; parent tracks single open index so tapping another card closes the previous one. Detect touch via `matchMedia('(hover: none)')` to disable hover-flip on touch devices.
  - Reduced motion: when `matchMedia('(prefers-reduced-motion: reduce)').matches`, swap the 3D rotate for a simple opacity crossfade between front/back (still using the same DOM, just toggle transitions).
- Accessibility: `aria-pressed={flipped}`, `aria-label` describing step + title, visible `focus-visible:ring-2 ring-accent` outline, both faces readable (back is not `aria-hidden` when flipped; front is when flipped, and vice versa).

## Icons

Reuse lucide icons already in the project style: `Compass` (step 1), `Users` or `Sparkles` for a "matching" feel (step 2), `MessageCircleHeart` (step 3). Icons ~28–32px on front (inside a 64px accent-tinted circle), ~20px on back.

## Edit to `src/routes/index.tsx`

- Remove the current `<section id="how-it-works">` block (the eyebrow + h2 + 3-card grid).
- Replace with `<HowItWorksFlipCards />`. Keep the surrounding `border-t border-border/60 py-20 md:py-28 container-page` framing inside the new component so the visual rhythm is preserved.
- Drop now-unused imports (`Compass`, `Sparkles`, `MessageCircleHeart`) from `index.tsx` if no longer referenced.

## Technical details

- Framer Motion is already used elsewhere; use plain CSS transforms here for the flip to keep it lightweight and honor reduced-motion cleanly. Tailwind arbitrary values: `[transform-style:preserve-3d]`, `[backface-visibility:hidden]`, `[perspective:1200px]`, `[transform:rotateY(180deg)]`.
- No new dependencies.
- No changes to copy elsewhere, no changes to data, backend, routes, or SEO metadata.

## Verification

- `bun run build` clean.
- Manual check via preview: hover flips on desktop, tap-to-flip with single-open behavior on mobile viewport, keyboard Enter/Space flips with visible focus ring, reduced-motion setting produces a fade instead of rotation, layout of neighboring sections unchanged.
