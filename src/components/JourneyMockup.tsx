import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import screen1 from "@/assets/screen-1.png.asset.json";
import screen2 from "@/assets/screen-2.png.asset.json";
import screen3 from "@/assets/screen-3.png.asset.json";
import screen4 from "@/assets/screen-4.png.asset.json";

/**
 * Realistic iPhone mockup showing real OwnWay app screens.
 * Rotates through 4 long portrait screenshots, each cropped to
 * the iPhone viewport (top-aligned) so the UI stays readable.
 */

const SCREENS = [
  { src: screen1.url, alt: "OwnWay — Tokyo destination with WayMakers" },
  { src: screen4.url, alt: "OwnWay — Elara Vance WayMaker profile" },
  { src: screen3.url, alt: "OwnWay — Send a note to a WayMaker" },
  { src: screen2.url, alt: "OwnWay — Traveler home with active connections" },
];

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
      {/* soft ambient glow */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,var(--color-accent)/25,transparent_70%)] blur-2xl" />

      {/* iPhone frame */}
      <div className="relative mx-auto w-[300px]">
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[230px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[3px] top-[180px] h-20 w-[3px] rounded-r-sm bg-neutral-800" />

        {/* titanium outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-10px_rgba(0,0,0,0.25)]">
          {/* inner bezel */}
          <div className="rounded-[2.85rem] bg-black p-[2px]">
            {/* screen — fixed aspect, top-aligned image crop */}
            <div className="relative h-[600px] w-[290px] overflow-hidden rounded-[2.7rem] bg-background">
              {/* dynamic island */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-20 flex h-[28px] w-[105px] -translate-x-1/2 items-center justify-end gap-1.5 rounded-full bg-black pr-3">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-x-0 top-0 w-full select-none"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* progress dots */}
              <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
                {SCREENS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === idx ? "w-5 bg-accent" : "w-1.5 bg-white/70 shadow"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
