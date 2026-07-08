"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ExpandingCardItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  icon: React.ReactNode;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: ExpandingCardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handle = () => setIsDesktop(window.innerWidth >= 768);
      handle();
      window.addEventListener("resize", handle);
      return () => window.removeEventListener("resize", handle);
    }, []);

    const gridStyle = React.useMemo<React.CSSProperties>(() => {
      const template = items
        .map((_, i) => (i === activeIndex ? "5fr" : "1fr"))
        .join(" ");
      return isDesktop
        ? { gridTemplateColumns: template }
        : { gridTemplateRows: template };
    }, [activeIndex, items, isDesktop]);

    return (
      <ul
        ref={ref}
        style={gridStyle}
        className={cn(
          "grid gap-3 transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
          "grid-flow-row md:grid-flow-col",
          className,
        )}
        {...props}
      >
        {items.map((item, i) => {
          const active = i === activeIndex;
          return (
            <li
              key={item.id}
              tabIndex={0}
              data-active={active}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card",
                "cursor-pointer outline-none transition-all duration-500 ease-out",
                "min-h-[220px] md:min-h-[420px]",
                active ? "ring-1 ring-accent/40" : "hover:border-accent/30",
              )}
            >
              {/* Collapsed rail (visible when not active) */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-between p-5 transition-opacity duration-300",
                  active ? "opacity-0 pointer-events-none" : "opacity-100",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                  {item.icon}
                </div>
                <p className="font-display text-lg leading-tight text-ink md:[writing-mode:vertical-rl] md:rotate-180 md:text-base">
                  {item.title}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Expanded content */}
              <div
                className={cn(
                  "relative flex h-full flex-col justify-between gap-4 p-6 md:p-8 transition-opacity duration-500 delay-150",
                  active ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
                      {item.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
                      {item.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl leading-snug text-ink md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>

                {item.bullets && item.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1.5 text-sm text-foreground/85">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);
ExpandingCards.displayName = "ExpandingCards";
