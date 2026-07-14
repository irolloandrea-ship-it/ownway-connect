import * as React from "react";
import { Compass, HeartHandshake, Map, type LucideIcon } from "lucide-react";
type LucideIconType = LucideIcon;

type Card = {
  step: string;
  frontTitle: string;
  icon: LucideIcon;
  backTitle: string;
  backBody: React.ReactNode;
};

const CARDS: Card[] = [
  {
    step: "STEP 01",
    icon: Compass,
    frontTitle: "Tell us how you travel",
    backTitle: "Your trip starts with you",
    backBody: (
      <>
        Share your destination, interests, budget, travel style and the kind of
        experience you're looking for. The better we understand you, the better
        the match.
      </>
    ),
  },
  {
    step: "STEP 02",
    icon: HeartHandshake,
    frontTitle: "Meet your right WayMaker",
    backTitle: "Personally curated by OwnWay",
    backBody: (
      <>
        Every Traveler request is{" "}
        <span className="font-medium text-accent">
          personally reviewed by our team
        </span>
        . We carefully select a WayMaker who best matches your destination,
        travel style and expectations. Because the best travel advice comes
        from the right person — not just any person.
      </>
    ),
  },
  {
    step: "STEP 03",
    icon: Map,
    frontTitle: "Find your OwnWay",
    backTitle: "Advice made for your trip",
    backBody: (
      <>
        Once your WayMaker accepts, connect directly and receive practical,
        personal advice tailored to your journey — not generic recommendations.
      </>
    ),
  },
];

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

function useIsTouch() {
  const [touch, setTouch] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    setTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return touch;
}

function FlipCard({
  card,
  flipped,
  onToggle,
  onHoverFlip,
  reducedMotion,
  isTouch,
  onboarding,
}: {
  card: Card;
  flipped: boolean;
  onToggle: () => void;
  onHoverFlip: (v: boolean) => void;
  reducedMotion: boolean;
  isTouch: boolean;
  onboarding: boolean;
}) {
  const Icon = card.icon;


  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className="group relative [perspective:1200px]"
      onMouseEnter={() => !isTouch && onHoverFlip(true)}
      onMouseLeave={() => !isTouch && onHoverFlip(false)}
    >
      <button
        type="button"
        onClick={onToggle}
        onKeyDown={handleKey}
        aria-pressed={flipped}
        aria-label={`${card.step}: ${card.frontTitle}. Activate to reveal details.`}
        className={`relative block h-[380px] w-full rounded-3xl outline-none transition-[transform,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background group-hover:-translate-y-1 md:h-[400px] ${
          onboarding ? "-translate-y-1.5 shadow-warm" : ""
        }`}
      >
        <div
          className={
            reducedMotion
              ? "relative h-full w-full"
              : "relative h-full w-full transition-transform duration-[600ms] ease-in-out [transform-style:preserve-3d]"
          }
          style={
            reducedMotion
              ? undefined
              : {
                  transform: flipped
                    ? "rotateY(180deg)"
                    : onboarding
                    ? "rotateY(10deg)"
                    : "rotateY(0deg)",
                }
          }
        >
          {/* FRONT */}
          <div
            aria-hidden={flipped}
            className={
              reducedMotion
                ? `absolute inset-0 flex flex-col items-center justify-between rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card transition-[opacity,box-shadow,border-color] duration-300 group-hover:shadow-warm lg:justify-start lg:gap-6 lg:pt-10 lg:group-hover:border-accent/40 ${
                    flipped ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`
                : "absolute inset-0 flex flex-col items-center justify-between rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card transition-[box-shadow,border-color] duration-300 [backface-visibility:hidden] group-hover:shadow-warm lg:justify-start lg:gap-6 lg:pt-10 lg:group-hover:border-accent/40"
            }
          >
            <p className="text-xs uppercase tracking-[0.28em] text-accent">
              {card.step}
            </p>
            <div className="flex flex-1 items-center justify-center lg:flex-none">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 transition-transform duration-500 ease-out lg:h-20 lg:w-20 lg:bg-accent/[0.07]"
                style={onboarding ? { transform: "scale(1.08)" } : undefined}
              >
                <Icon
                  className="h-11 w-11 text-accent lg:h-9 lg:w-9"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </div>
            </div>
            <div className="space-y-2 lg:mt-2">
              <h3 className="font-display text-2xl leading-tight text-ink lg:text-[34px] lg:leading-[1.15]">
                {card.frontTitle}
              </h3>
            </div>
          </div>

          {/* BACK */}
          <div
            aria-hidden={!flipped}
            className={
              reducedMotion
                ? `absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-card p-8 text-center shadow-warm transition-opacity duration-300 ${
                    flipped ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`
                : "absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-card p-8 text-center shadow-warm [backface-visibility:hidden] [transform:rotateY(180deg)]"
            }
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Icon className="h-5 w-5 text-accent" strokeWidth={1.8} />
            </div>
            <h3 className="mt-4 font-display text-2xl leading-tight text-ink">
              {card.backTitle}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {card.backBody}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function HowItWorksFlipCards() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [onboardingIndex, setOnboardingIndex] = React.useState<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const hasPlayedRef = React.useRef(false);

  React.useEffect(() => {
    if (reducedMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            observer.disconnect();
            const timeouts: ReturnType<typeof setTimeout>[] = [];
            CARDS.forEach((_, i) => {
              timeouts.push(
                setTimeout(() => setOnboardingIndex(i), i * 200),
              );
              timeouts.push(
                setTimeout(() => {
                  setOnboardingIndex((cur) => (cur === i ? null : cur));
                }, i * 200 + 250 + 500),
              );
            });
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="container-page border-t border-border/60 py-20 md:py-28"
    >
      <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">
        How OwnWay works
      </p>
      <h2 className="mx-auto mt-3 max-w-3xl text-center text-4xl md:text-5xl">
        AI can give you answers. OwnWay connects you with people who have lived them.
      </h2>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {CARDS.map((card, i) => {
          const flipped = isTouch
            ? openIndex === i
            : hoverIndex === i || openIndex === i;
          return (
            <FlipCard
              key={card.step}
              card={card}
              flipped={flipped}
              reducedMotion={reducedMotion}
              isTouch={isTouch}
              onboarding={onboardingIndex === i && !flipped}
              onToggle={() =>

                setOpenIndex((prev) => (prev === i ? null : i))
              }
              onHoverFlip={(v) => setHoverIndex(v ? i : null)}
            />
          );
        })}
      </div>
    </section>
  );
}
