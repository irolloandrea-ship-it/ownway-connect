"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
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
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);

    return (
      <ul
        ref={ref}
        className={cn(
          "divide-y divide-border/70 overflow-hidden rounded-3xl border border-border bg-card shadow-card",
          className,
        )}
        {...props}
      >
        {items.map((item, i) => {
          const active = i === activeIndex;
          const openOnHover = () => {
            // hover-capable pointer only (desktop); mobile keeps click behavior
            if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
              setActiveIndex(i);
            }
          };
          return (
            <li key={item.id} onMouseEnter={openOnHover} onFocus={openOnHover}>
              <button
                type="button"
                onClick={() => setActiveIndex(active ? null : i)}
                aria-expanded={active}
                className={cn(
                  "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors md:px-6",
                  active ? "bg-sand/40" : "hover:bg-sand/30",
                )}
              >

                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    active ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent",
                  )}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                    {item.eyebrow}
                  </p>
                  <p className="mt-0.5 font-display text-base leading-snug text-ink md:text-lg">
                    {item.title}
                  </p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
                  {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pl-[calc(1.25rem+40px+1rem)] md:px-6 md:pb-6 md:pl-[calc(1.5rem+40px+1rem)]">
                      <p className="text-sm text-muted-foreground md:text-[15px]">
                        {item.description}
                      </p>
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                          {item.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    );
  },
);
ExpandingCards.displayName = "ExpandingCards";
