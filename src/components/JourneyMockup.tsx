import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import screen1 from "@/assets/screen-1.png.asset.json";
import screen2 from "@/assets/screen-2.png.asset.json";
import screen3 from "@/assets/screen-3.png.asset.json";
import screen4 from "@/assets/screen-4.png.asset.json";

/**
 * Realistic iPhone mockup showing real OwnWay app screens.
 * - Screens render at natural width (no blurry upscale)
 * - Safe-area padding reserves space for the Dynamic Island
 * - Progress dots live BELOW the phone, never over app UI
 */

const SCREENS = [
  { src: screen1.url, alt: "OwnWay — Tokyo destination with WayMakers" },
  { src: screen4.url, alt: "OwnWay — Elara Vance WayMaker profile" },
  { src: screen3.url, alt: "OwnWay — Send a note to a WayMaker" },
  { src: screen2.url, alt: "OwnWay — Traveler home with active connections" },
];

const PHONE_W = 300; // outer frame width
const SCREEN_W = 290; // inner screen width
const SCREEN_H = 620; // inner screen height
const ISLAND_SAFE = 44; // top safe area for the Dynamic Island

export function JourneyMockup() {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const current = SCREENS[idx];

  return (
    <div
      className="relative"
      role="img"
      aria-label="OwnWay app previews inside an iPhone: destination page, WayMaker profile, connection request, and traveler home."
    >
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,var(--color-accent)/25,transparent_70%)] blur-2xl" />

      <div className="relative mx-auto" style={{ width: PHONE_W }}>
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[230px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[3px] top-[180px] h-20 w-[3px] rounded-r-sm bg-neutral-800" />

        {/* titanium outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-10px_rgba(0,0,0,0.25)]">
          <div className="rounded-[2.85rem] bg-black p-[2px]">
            {/* screen viewport */}
            <div
              className="relative overflow-hidden rounded-[2.7rem] bg-background"
              style={{ width: SCREEN_W, height: SCREEN_H }}
            >
              {/* Safe area strip (visual matches phone chrome) */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-background"
                style={{ height: ISLAND_SAFE }}
              />

              {/* Dynamic island */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-20 flex h-[28px] w-[105px] -translate-x-1/2 items-center justify-end gap-1.5 rounded-full bg-black pr-3">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
              </div>

              {/* App screen — pushed below the island, natural-width, sharp */}
              <div
                className="absolute inset-x-0 overflow-hidden"
                style={{ top: ISLAND_SAFE, height: SCREEN_H - ISLAND_SAFE }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.src}
                    src={current.src}
                    alt={current.alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="block w-full select-none"
                    style={{ height: "auto", imageRendering: "auto" }}
                    draggable={false}
                    decoding="async"
                    loading="eager"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots — OUTSIDE the phone frame */}
        <div className="mt-5 flex justify-center gap-1.5">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show screen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
