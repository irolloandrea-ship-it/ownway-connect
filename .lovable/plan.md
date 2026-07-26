## Goal
Create a generic workspace skill named `iphone-app-mockup-carousel` that reproduces the OwnWay landing-page iPhone mockup experience around a set of uploaded PNG screenshots.

## Skill design

### Name and description
- **Name:** `iphone-app-mockup-carousel`
- **Description:** Use when the user wants to add a realistic iPhone app preview carousel to a React/TanStack Start landing page. Expects PNG screenshots, outputs a framed phone component with auto-advance, manual arrows, and dot indicators.

### What the skill will do
1. Read the uploaded screenshot assets to determine their natural aspect ratio.
2. Create a reusable carousel component at `src/components/ui/iphone-app-carousel.tsx` (or a project-appropriate path).
3. Render the screenshots inside a realistic iPhone frame: titanium outer shell, side buttons, Dynamic Island, black bezel, and rounded screen mask.
4. Add carousel behavior: auto-advance every 3.8–4.2 s, loop, previous/next arrows on desktop, tap arrows on mobile, dot indicators below the frame, and Framer Motion slide transitions.
5. Keep the component generic by accepting screens via props, not hard-coding asset imports.
6. Provide a usage example showing how to pass the screenshots into the component from a route file.

### Draft `SKILL.md` body

```markdown
---
name: iphone-app-mockup-carousel
description: Use when the user wants to add a realistic iPhone app preview carousel to a React/TanStack Start landing page. Expects PNG screenshots, outputs a framed phone component with auto-advance, manual arrows, and dot indicators.
---

# iPhone app mockup carousel

## When to use
- User asks for an iPhone mockup / phone preview / app screenshot carousel on a landing page.
- User has uploaded PNG screenshots of app screens and wants them framed inside a realistic iPhone.
- The project is a React/TanStack Start project using Tailwind CSS and Framer Motion.

## Inputs
- A list of app screenshots (PNG/WebP) the user wants inside the carousel. Accept them as uploaded assets or ask for them if missing.
- Desired screen width in pixels (default: 290). Height is derived from the screenshot's native aspect ratio.

## Workflow

1. **Inspect the screenshots.** Read the native dimensions of each uploaded image (use `ffprobe` or a Python PIL script). Determine the dominant aspect ratio. Compute the frame height from `SCREEN_W * native_height / native_width` so the phone fits the screenshots without cropping or upscaling blur.

2. **Create the component.** Write `src/components/ui/iphone-app-carousel.tsx` containing:
   - A `Screen` type: `{ src: string; alt: string; label: string }`.
   - A `IphoneAppCarousel` component that accepts `screens: Screen[]` and an optional `className`.
   - Realistic iPhone frame rendered with CSS: titanium gradient outer shell, rounded corners (`rounded-[3rem]`), side buttons, black inner bezel, and an overflow-hidden screen window.
   - `AnimatePresence` + `motion.img` for cross-fade/slide transitions between screens.
   - State for `activeIndex`, `direction`, and `paused`.
   - `useEffect` interval for auto-advance; pause for 6 s after any manual interaction.
   - Desktop arrows positioned outside the frame, visible on hover.
   - Mobile arrows and dot indicators below the frame.
   - Touch swipe support for left/right navigation.

3. **Wire the carousel into the page.** In the route or section that needs the mockup, import the screenshots as assets, build the `screens` array, and render `<IphoneAppCarousel screens={screens} />`. Add a concise section title and remove any redundant carousel indicators inside the phone frame.

4. **Validate the result.**
   - Build the project and check for errors.
   - Open the preview and verify the screenshots are sharp (not scaled up), centered, and fully visible within the frame.
   - Confirm auto-advance, arrows, dots, and touch swipe all work.
   - Check that no dots or progress bars appear inside the phone frame itself.

## Conventions
- Place the component in `src/components/ui/` unless the project uses a different shared-component directory.
- Keep screenshot imports in the route file, not inside the reusable component, so the carousel stays generic.
- Use Tailwind utility classes and inline `style` for precise frame dimensions.
- Prefer `object-cover object-top` only when the screen content should be cropped to the top; otherwise use `object-contain` to avoid distortion.

## Validation
- Project builds with no errors.
- Preview shows the carousel, auto-advances, and responds to arrows/dots/swipe.
- Screenshots render at native pixel density without visible blur or stretching.
- No extra indicators inside the iPhone frame.
```

## File layout
```text
.agents/skills/iphone-app-mockup-carousel/
└── SKILL.md
```

## Next steps
- Create the `.agents/skills/iphone-app-mockup-carousel/SKILL.md` file with the draft above.
- Call `skills--apply_draft` with `.agents/skills/iphone-app-mockup-carousel` to activate it.
- Confirm the skill is available in the workspace.