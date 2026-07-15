"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingCarouselItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  icon: React.ReactNode;
}

interface FloatingCarouselProps {
  items: FloatingCarouselItem[];
  autoAdvanceMs?: number;
  className?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Card({
  item,
  variant,
}: {
  item: FloatingCarouselItem;
  variant: "active" | "peek";
}) {
  const isPeek = variant === "peek";
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-3xl border border-border bg-card p-7 text-left md:p-9",
        isPeek ? "shadow-card" : "shadow-warm",
      )}
      aria-hidden={isPeek}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          {item.icon}
        </span>
        <p className="text-xs uppercase tracking-[0.25em] text-accent">
          {item.eyebrow}
        </p>
      </div>
      <h3 className="mt-5 font-display text-2xl leading-tight text-ink md:text-[28px] md:leading-[1.2]">
        {item.title}
      </h3>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      {item.bullets && item.bullets.length > 0 && (
        <ul className="mt-5 space-y-2">
          {item.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-ink/80"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FloatingCarousel({
  items,
  autoAdvanceMs = 6000,
  className,
}: FloatingCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const total = items.length;
  const touchStartX = React.useRef<number | null>(null);

  const go = React.useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );
  const goTo = React.useCallback((i: number) => setIndex(i), []);

  // Auto-advance
  React.useEffect(() => {
    if (reducedMotion || paused || total <= 1) return;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(() => go(1), autoAdvanceMs);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reducedMotion, paused, total, autoAdvanceMs, go, index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPaused(true);
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPaused(true);
      go(-1);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setPaused(true);
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  const prevIdx = (index - 1 + total) % total;
  const nextIdx = (index + 1) % total;

  const transition = reducedMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.9 };

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Feature highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
    >
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {index + 1} of {total}: {items[index].title}
      </span>

      {/* Stage */}
      <div className="relative mx-auto h-[460px] w-full max-w-3xl md:h-[440px]">
        <AnimatePresence initial={false}>
          {/* Peek left */}
          {total > 1 && (
            <motion.div
              key={`peek-l-${prevIdx}`}
              className="pointer-events-none absolute left-0 top-1/2 hidden h-[86%] w-[62%] -translate-y-1/2 md:block"
              initial={{ opacity: 0, x: -40, scale: 0.8 }}
              animate={{ opacity: 0.35, x: "-38%", scale: 0.85 }}
              exit={{ opacity: 0, x: -40, scale: 0.8 }}
              transition={transition}
              style={{ filter: "blur(0.5px)" }}
            >
              <Card item={items[prevIdx]} variant="peek" />
            </motion.div>
          )}

          {/* Active */}
          <motion.div
            key={`active-${index}`}
            className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 md:w-[78%]"
            initial={{ opacity: 0, x: reducedMotion ? 0 : 60, scale: 0.96 }}
            animate={{ opacity: 1, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: reducedMotion ? 0 : -60, scale: 0.96 }}
            transition={transition}
          >
            <Card item={items[index]} variant="active" />
          </motion.div>

          {/* Peek right */}
          {total > 1 && (
            <motion.div
              key={`peek-r-${nextIdx}`}
              className="pointer-events-none absolute right-0 top-1/2 hidden h-[86%] w-[62%] -translate-y-1/2 md:block"
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 0.35, x: "38%", scale: 0.85 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={transition}
              style={{ filter: "blur(0.5px)" }}
            >
              <Card item={items[nextIdx]} variant="peek" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            go(-1);
          }}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-ink shadow-card backdrop-blur transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:-left-4"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            go(1);
          }}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-ink shadow-card backdrop-blur transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:-right-4"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.6} />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => {
              setPaused(true);
              goTo(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              i === index
                ? "w-8 bg-accent"
                : "w-2.5 bg-border hover:bg-accent/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
