import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Screen = { src: string; alt: string };

type OwnWayPhoneCarouselProps = {
  screens: Screen[];
  className?: string;
};

// Native screenshot ratio: 780 × 1768
const SCREEN_W = 290;
const SCREEN_H = Math.round((SCREEN_W * 1768) / 780); // 657

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.985,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.985,
  }),
};

export function OwnWayPhoneCarousel({ screens, className }: OwnWayPhoneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((c) => (c + 1) % screens.length);
  };
  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((c) => (c === 0 ? screens.length - 1 : c - 1));
  };
  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setDirection(1);
      setActiveIndex((c) => (c + 1) % screens.length);
    }, 3800);
    return () => clearInterval(t);
  }, [paused, screens.length]);

  const pauseBriefly = () => {
    setPaused(true);
    window.setTimeout(() => setPaused(false), 6000);
  };

  const handlePrev = () => { pauseBriefly(); goToPrevious(); };
  const handleNext = () => { pauseBriefly(); goToNext(); };
  const handleDot = (i: number) => { pauseBriefly(); goToSlide(i); };

  const current = screens[activeIndex];

  return (
    <div className={cn("group relative mx-auto flex flex-col items-center", className)}>
      {/* Ambient glow */}
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,var(--color-accent)/20,transparent_70%)] blur-2xl" />

      {/* iPhone frame */}
      <div className="relative" style={{ width: SCREEN_W + 10 }}>
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -left-[3px] top-[230px] h-14 w-[3px] rounded-l-sm bg-neutral-800" />
        <div className="absolute -right-[3px] top-[180px] h-20 w-[3px] rounded-r-sm bg-neutral-800" />

        {/* Titanium outer frame */}
        <div className="rounded-[3rem] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[3px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_-10px_rgba(0,0,0,0.25)]">
          <div className="rounded-[2.85rem] bg-black p-[2px]">
            {/* Screen */}
            <div
              className="relative overflow-hidden rounded-[2.7rem] bg-background"
              style={{ width: SCREEN_W, height: SCREEN_H }}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 30 },
                    opacity: { duration: 0.25 },
                    scale: { duration: 0.3 },
                  }}
                  className="absolute inset-0 h-full w-full select-none object-cover object-top"
                  draggable={false}
                  decoding="async"
                  loading="eager"
                />
              </AnimatePresence>

              {/* Desktop arrows (inside screen edges, subtle) */}
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous app screen"
                className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 md:flex group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next app screen"
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/40 p-1.5 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/60 md:flex group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / always-visible controls */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous app screen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-sand/60"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {screens.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show app screen ${index + 1}`}
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
          onClick={goToNext}
          aria-label="Next app screen"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-sand/60"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Tap to preview the app experience
      </p>
    </div>
  );
}
