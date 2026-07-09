import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import screen1 from "@/assets/screen-1.png.asset.json";
import screen2 from "@/assets/screen-2.png.asset.json";
import screen3 from "@/assets/screen-3.png.asset.json";
import screen4 from "@/assets/screen-4.png.asset.json";

/**
 * iPhone mockup sized to the screenshot's native aspect ratio (780×1768).
 * The frame adapts to the image — never the other way around.
 * No Dynamic Island overlay, no external carousel dots.
 */

const SCREENS = [
  { src: screen1.url, alt: "OwnWay — Tokyo destination with WayMakers" },
  { src: screen4.url, alt: "OwnWay — Elara Vance WayMaker profile" },
  { src: screen3.url, alt: "OwnWay — Send a note to a WayMaker" },
  { src: screen2.url, alt: "OwnWay — Traveler home with active connections" },
];

// Native screenshot: 780 × 1768 (aspect ≈ 0.4412)
const SCREEN_W = 290;
const SCREEN_H = Math.round((SCREEN_W * 1768) / 780); // 657

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
      aria-label="OwnWay app previews inside an iPhone."
    >
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,var(--color-accent)/25,transparent_70%)] blur-2xl" />

      <div className="relative mx-auto" style={{ width: SCREEN_W + 10 }}>
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[230px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[3px] top-[180px] h-20 w-[3px] rounded-r-sm bg-neutral-800" />

        {/* titanium outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-10px_rgba(0,0,0,0.25)]">
          <div className="rounded-[2.85rem] bg-black p-[2px]">
            <div
              className="relative overflow-hidden rounded-[2.7rem] bg-background"
              style={{ width: SCREEN_W, height: SCREEN_H }}
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
                  className="absolute inset-0 h-full w-full select-none object-cover object-top"
                  draggable={false}
                  decoding="async"
                  loading="eager"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
