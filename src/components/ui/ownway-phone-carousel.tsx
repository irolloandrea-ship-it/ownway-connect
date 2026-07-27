import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import hero1 from "@/assets/screen-v2-1.png.asset.json";
import hero2 from "@/assets/screen-v2-2.png.asset.json";
import hero3 from "@/assets/screen-v2-3.png.asset.json";
import hero4 from "@/assets/screen-v2-4.png.asset.json";
import hero5 from "@/assets/screen-v2-5.png.asset.json";
import hero6 from "@/assets/screen-v2-6.png.asset.json";

const APP_SCREENS = [
  { key: "explore", label: "Explore destinations", src: hero1.url, alt: "OwnWay app — explore curated journeys with Rome featured" },
  { key: "dates", label: "Pick travel dates", src: hero2.url, alt: "OwnWay app — pick your travel dates on the September calendar" },
  { key: "style", label: "Travel style", src: hero3.url, alt: "OwnWay app — choose Relaxed & Slow or Adventurous & Active" },
  { key: "matching", label: "Finding your WayMaker", src: hero4.url, alt: "OwnWay app — finding your WayMakers for Florence" },
  { key: "suggested", label: "Suggested WayMakers", src: hero5.url, alt: "OwnWay app — suggested WayMaker Isabella Rossi in Florence" },
  { key: "journeys", label: "My Journeys", src: hero6.url, alt: "OwnWay app — My Journeys dashboard with upcoming Florence trip" },
];


type OwnWayPhoneCarouselProps = {
  className?: string;
};

// Sized to native screenshot aspect (780×1768) so nothing is cropped.
const SCREEN_W = 290;
const SCREEN_H = Math.round((SCREEN_W * 1768) / 780); // 657
const SCREEN_BG = "#F5F2E9";

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export function OwnWayPhoneCarousel(_: OwnWayPhoneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = APP_SCREENS.length;

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((c) => (c + 1) % total);
  };
  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((c) => (c === 0 ? total - 1 : c - 1));
  };
  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setActiveIndex((c) => (c + 1) % total);
    }, 3800);
    return () => clearInterval(t);
  }, [paused, total]);

  const pauseBriefly = () => {
    setPaused(true);
    window.setTimeout(() => setPaused(false), 6000);
  };
  const handlePrev = () => { pauseBriefly(); goToPrevious(); };
  const handleNext = () => { pauseBriefly(); goToNext(); };
  const handleDot = (i: number) => { pauseBriefly(); goToSlide(i); };

  // basic touch swipe
  const touch = React.useRef<{ x: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (dx > 40) handlePrev();
    else if (dx < -40) handleNext();
    touch.current = null;
  };

  const current = APP_SCREENS[activeIndex];

  return (
    <div className={cn("group relative mx-auto flex flex-col items-center", _.className)}>
      {/* Ambient glow */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,var(--color-accent)/20,transparent_70%)] blur-2xl" />

      <div className="relative" style={{ width: SCREEN_W + 10 }}>
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[92px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[140px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[210px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[3px] top-[160px] h-20 w-[3px] rounded-r-sm bg-neutral-800" />

        {/* Titanium outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-10px_rgba(0,0,0,0.25)]">
          <div className="rounded-[2.85rem] bg-black p-[2px]">
            <div
              className="relative overflow-hidden rounded-[2.7rem]"
              style={{ width: SCREEN_W, height: SCREEN_H, background: "#FAFAF5" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={current.key}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 30 },
                    opacity: { duration: 0.22 },
                  }}
                  className="absolute inset-0"
                >
                  <img
                    src={current.src}
                    alt={current.alt}
                    className="h-full w-full select-none object-cover object-top"
                    draggable={false}
                    decoding="async"
                    loading="eager"
                  />
                </motion.div>

              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop arrows outside frame */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous app screen"
          className="absolute left-[-56px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-ink opacity-0 shadow-sm transition hover:bg-sand/60 md:flex group-hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next app screen"
          className="absolute right-[-56px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-ink opacity-0 shadow-sm transition hover:bg-sand/60 md:flex group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dots + mobile controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous app screen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-sand/60 md:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {APP_SCREENS.map((s, index) => (
            <button
              key={s.key}
              type="button"
              onClick={() => handleDot(index)}
              aria-label={`Show ${s.label} screen`}
              className={cn(
                "h-2 rounded-full transition-all",
                activeIndex === index
                  ? "w-8 bg-[#E26F4F]"
                  : "w-2 bg-[#E8D7C5] hover:bg-[#F7BE8A]"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next app screen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-sand/60 md:hidden"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
