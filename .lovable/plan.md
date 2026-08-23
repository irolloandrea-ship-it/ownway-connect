Forest & Sage palette refresh for the landing page

## Goal
Replace the current dark-green + bright-orange scheme with a calmer, more botanical "Forest & Sage" palette while keeping the dark green as the main OwnWay brand colour.

## Selected palette
- Primary/ink: `#163428` (dark forest green) — kept as the main brand colour
- Background: `#e8ede6` (pale sage) — replaces the warm cream `#fff8f0`
- Secondary/muted: `#a8b5a0` (soft sage) — replaces the terracotta sand band
- Accent: `#a8b5a0` (soft sage) or `#4a6350` (muted olive) — replaces the bright orange `#f26c4f`
- Supporting olive: `#4a6350` (muted olive) — used for secondary text and subtle details

## Work to do

1. Update `src/styles.css`
   - Replace `--background` with `#e8ede6` and `--foreground` with `#163428`.
   - Replace `--secondary` with `#dce5d4` (a slightly deeper sage band).
   - Replace `--muted` with `#dce5d4` and `--muted-foreground` with `#4a6350`.
   - Replace `--accent` with `#a8b5a0` and `--accent-foreground` with `#163428`.
   - Replace `--sand` with `#dce5d4` and `--terracotta` with `#a8b5a0`.
   - Keep `--primary` as `#163428` and `--primary-foreground` as `#e8ede6`.
   - Update warm shadows and gradients from orange/coral hues to green/sage hues so the page does not accidentally retain orange tones.
   - Update the `.dark` theme variables to a matching sage-on-dark version.

2. Audit and update hardcoded colours
   - Search the project for `#f26c4f`, `#e9d8c6`, `#fff8f0`, `#163428`, and any `terracotta`/`orange`/`coral` utility classes.
   - Replace old hardcoded values with the new semantic tokens (`--accent`, `--sand`, `--background`, etc.).
   - Pay special attention to `src/routes/index.tsx`, `src/components/ui/ownway-phone-carousel.tsx`, `src/components/JoinEarlyAccess.tsx`, `src/components/ui/proof-card.tsx`, and `src/components/SiteHeader.tsx`/`SiteFooter.tsx`.

3. Update the in-phone mockup screens
   - The app screens inside the iPhone carousel currently use the warm cream/orange palette.
   - Recolour them to pale-sage backgrounds and soft-sage accents so the mockup looks coherent with the new landing page.

4. Verify hero image harmony
   - Confirm the Florence hero photo still works with the sage background; if needed, adjust the overlay or surrounding colour to avoid clashing.

5. Smoke-test the change
   - Run the local dev build and open the homepage at desktop and mobile widths.
   - Check that buttons, FAQ cards, role cards, and the phone carousel all render in the new palette without leftover orange.
