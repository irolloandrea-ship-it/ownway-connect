import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Check, MessageSquare, ArrowRight } from "lucide-react";

/**
 * Realistic iPhone mockup showing the OwnWay journey (no chat UI).
 * 3 rotating screens: trip request → matches → contact unlocked.
 */

type Screen = "request" | "matches" | "contact";
const SCREENS: Screen[] = ["request", "matches", "contact"];

export function JourneyMockup() {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const screen = SCREENS[idx];

  return (
    <div
      className="relative"
      role="img"
      aria-label="OwnWay journey mockup: create a trip, view WayMaker matches, unlock contact after acceptance."
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
            {/* screen */}
            <div className="relative overflow-hidden rounded-[2.7rem] bg-background">
              {/* dynamic island */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-20 flex h-[28px] w-[105px] -translate-x-1/2 items-center justify-end gap-1.5 rounded-full bg-black pr-3">
                <div className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
              </div>

              {/* status bar */}
              <div className="flex items-center justify-between px-6 pb-1 pt-2.5 text-[11px] font-semibold text-ink">
                <span>9:41</span>
                <span className="opacity-0">.</span>
                <span className="flex items-center gap-1">
                  <span className="flex items-end gap-[1.5px]">
                    <span className="h-[3px] w-[2px] rounded-sm bg-ink" />
                    <span className="h-[5px] w-[2px] rounded-sm bg-ink" />
                    <span className="h-[7px] w-[2px] rounded-sm bg-ink" />
                    <span className="h-[9px] w-[2px] rounded-sm bg-ink" />
                  </span>
                  <svg width="13" height="9" viewBox="0 0 13 9" fill="none" className="text-ink">
                    <path d="M6.5 8.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
                    <path d="M3.5 5.2a4.5 4.5 0 016 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <path d="M1.5 3a7.5 7.5 0 0110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                  <span className="ml-0.5 flex h-[10px] w-[22px] items-center rounded-[3px] border border-ink px-[1.5px]">
                    <span className="h-[6px] w-[15px] rounded-[1px] bg-ink" />
                  </span>
                </span>
              </div>

              {/* app header */}
              <div className="border-b border-border/70 bg-sand/60 px-4 pb-3 pt-2">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-accent">OwnWay</p>
                <p className="font-display text-[15px] leading-tight text-ink">
                  {screen === "request" && "Your trip request"}
                  {screen === "matches" && "Your WayMaker matches"}
                  {screen === "contact" && "Contact unlocked"}
                </p>
              </div>

              {/* body — fixed height, no jump */}
              <div className="relative h-[500px] overflow-hidden px-4 py-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex h-full flex-col gap-3"
                  >
                    {screen === "request" && <RequestScreen />}
                    {screen === "matches" && <MatchesScreen />}
                    {screen === "contact" && <ContactScreen />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* dots */}
              <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                {SCREENS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === idx ? "w-5 bg-accent" : "w-1.5 bg-border"
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

function RequestScreen() {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <MapPin className="h-3 w-3 text-accent" />
          Destination
        </div>
        <p className="mt-1 font-display text-xl text-ink">Florence</p>
        <p className="text-xs text-muted-foreground">Italy · 3 days</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">You're looking for</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Food", "Local neighborhoods", "Hidden places"].map((t) => (
            <span key={t} className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] text-ink">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between rounded-2xl bg-accent/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <p className="text-[11px] font-medium text-accent">Matching in progress</p>
        </div>
        <p className="text-[10px] text-muted-foreground">OwnWay</p>
      </div>
    </>
  );
}

function MatchesScreen() {
  const cards = [
    { name: "Sofia", tags: "Food · local areas · easy routes", featured: true },
    { name: "Luca", tags: "Hidden places · slow travel" },
    { name: "Chiara", tags: "Neighborhoods · markets" },
  ];
  return (
    <>
      <p className="text-[11px] text-muted-foreground">
        3 WayMakers selected for your trip to Florence.
      </p>
      {cards.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.12 }}
          className={`flex items-center gap-3 rounded-2xl border p-3 shadow-soft ${
            c.featured ? "border-accent/40 bg-card" : "border-border bg-card/70"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand font-display text-sm text-ink">
            {c.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-ink">{c.name} · Florence</p>
            <p className="truncate text-[10.5px] text-muted-foreground">{c.tags}</p>
          </div>
          {c.featured && (
            <button
              type="button"
              className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1.5 text-[10.5px] font-medium text-accent-foreground shadow-sm"
            >
              Request <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </motion.div>
      ))}
      <p className="mt-auto text-center text-[10px] text-muted-foreground">
        You choose · you request · WayMaker decides
      </p>
    </>
  );
}

function ContactScreen() {
  return (
    <>
      <div className="rounded-2xl border border-accent/30 bg-accent/8 p-4 shadow-soft">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-accent">
          <Check className="h-3 w-3" />
          Request accepted
        </div>
        <p className="mt-2 font-display text-lg leading-snug text-ink">
          Sofia accepted your request.
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          You can now reach out and plan your Florence trip together.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Preferred contact
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sand">
              <MessageSquare className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-[12.5px] font-medium text-ink">WhatsApp</p>
              <p className="text-[10.5px] text-muted-foreground">Available after acceptance</p>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div className="mt-3 rounded-xl bg-sand px-3 py-2 text-[11px] font-mono text-ink">
          +39 •• ••• ••• 42
        </div>
      </div>

      <p className="mt-auto text-center text-[10px] italic text-muted-foreground">
        Contact happens outside OwnWay.
      </p>
    </>
  );
}
