---
name: iphone-app-mockup-carousel
description: Use when the user wants to add a realistic iPhone app preview carousel to a React/TanStack Start landing page. Expects PNG screenshots, outputs a framed phone component with auto-advance, manual arrows, and dot indicators.
---

# iPhone app mockup carousel

## When to use
- User asks for an iPhone mockup, phone preview, or app screenshot carousel on a landing page.
- User has uploaded PNG/WebP screenshots of app screens and wants them framed inside a realistic iPhone.
- The project is a React/TanStack Start project using Tailwind CSS and Framer Motion.

## Inputs
- A list of app screenshots as uploaded assets. Ask for them if not provided.
- Desired phone width in pixels (default 290). Height is derived from the screenshots' native aspect ratio.

## Workflow

1. **Inspect the screenshots.** Read the native dimensions of each uploaded image. Determine the dominant aspect ratio and compute `SCREEN_H = SCREEN_W * native_height / native_width` so the frame fits the screenshots without cropping or upscaling blur.

2. **Create the carousel component.** Write `src/components/ui/iphone-app-carousel.tsx`:
   - Export `Screen` type: `{ src: string; alt: string; label: string }`.
   - Export `IphoneAppCarousel({ screens, className })` that accepts `screens: Screen[]`.
   - Render a realistic iPhone frame with CSS: titanium gradient outer shell, rounded corners (`rounded-[3rem]`), black inner bezel, side buttons, and an overflow-hidden screen window.
   - Use `AnimatePresence` + `motion.img` for slide transitions between screens.
   - Track `activeIndex`, `direction`, and `paused` in state.
   - Auto-advance every 3.8–4.2 seconds with `useEffect` interval; loop back to the first screen.
   - Pause auto-advance for 6 seconds after any manual interaction (arrows, dots, swipe).
   - Show desktop arrows outside the frame, visible on hover.
   - Show mobile arrows and dot indicators below the frame.
   - Add touch swipe support for left/right navigation.

3. **Wire it into the page.** In the route or section that needs the mockup, import the screenshots as assets, build the `screens` array, and render `<IphoneAppCarousel screens={screens} />`. Add a concise section title and remove any redundant carousel indicators inside the phone frame.

4. **Validate the result.**
   - Build the project and check for errors.
   - Open the preview and verify the screenshots are sharp, centered, and fully visible within the frame.
   - Confirm auto-advance, arrows, dots, and swipe all work.
   - Confirm no dots or progress bars appear inside the phone frame itself.

## Conventions
- Place the component in `src/components/ui/` unless the project uses a different shared-component directory.
- Keep screenshot imports in the route file, not inside the component, so the carousel stays reusable.
- Use Tailwind utilities and inline `style` for precise frame dimensions.
- Use `object-cover object-top` only when the content should be cropped to the top; otherwise use `object-contain` to avoid distortion.
- Keep the component generic: accept colors via props only if the user explicitly asks for a different palette; otherwise use neutral iPhone frame colors and let the screenshots provide the app visuals.

## Validation
- Project builds with no errors.
- Preview shows the carousel, auto-advances, and responds to arrows/dots/swipe.
- Screenshots render at native pixel density without visible blur or stretching.
- No extra indicators inside the iPhone frame.
