import * as React from "react";

/**
 * OwnWay in-app screens rendered as sharp React DOM (not screenshots),
 * modeled on the Google Stitch OwnWay design system.
 *
 * Each screen is designed for a 290 × 657 iPhone viewport.
 * Uses inline hex tokens so it does not depend on Tailwind config extensions.
 */

const T = {
  bg: "#FAFAF5",
  surface: "#FFFFFF",
  surfaceLow: "#F1F0EA",
  surfaceHigh: "#E8E8E4",
  outline: "#D8D8D2",
  primary: "#163428",
  primaryFixed: "#C8EAD8",
  onSurface: "#1A1C19",
  onSurfaceVariant: "#424844",
  secondary: "#7D562D",
  secondaryContainer: "#FFDCBD",
  accent: "#E26F4F",
  accentSoft: "#F7BE8A",
};

const FONT_HEAD = `'Literata', ui-serif, Georgia, serif`;
const FONT_BODY = `'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, sans-serif`;

/* ---------------- Chrome ---------------- */

function StatusBar() {
  return (
    <div
      className="flex items-center justify-between px-5 pt-2 pb-1"
      style={{ fontFamily: FONT_BODY, color: T.onSurface }}
    >
      <span className="text-[11px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1">
        {/* signal */}
        <svg width="14" height="9" viewBox="0 0 16 10" fill="none">
          <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill={T.onSurface} />
          <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill={T.onSurface} />
          <rect x="7" y="3" width="2.5" height="7" rx="0.5" fill={T.onSurface} />
          <rect x="10.5" y="1" width="2.5" height="9" rx="0.5" fill={T.onSurface} />
        </svg>
        {/* wifi */}
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M6 8.2l1.4-1.4a2 2 0 0 0-2.8 0L6 8.2z" fill={T.onSurface} />
          <path d="M2.6 4.9l1 1a3.4 3.4 0 0 1 4.8 0l1-1a4.8 4.8 0 0 0-6.8 0z" fill={T.onSurface} />
          <path d="M.6 2.9l1 1a6.2 6.2 0 0 1 8.8 0l1-1a7.6 7.6 0 0 0-10.8 0z" fill={T.onSurface} />
        </svg>
        {/* battery */}
        <div className="ml-0.5 flex h-[9px] w-[18px] items-center rounded-[2px] border border-current px-[1px]">
          <div className="h-[5px] w-[13px] rounded-[1px]" style={{ background: T.onSurface }} />
        </div>
      </div>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[6px] z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
  );
}

function BottomNav({ active = "explore" }: { active?: "explore" | "trips" | "profile" }) {
  const item = (key: "explore" | "trips" | "profile", label: string, icon: React.ReactNode) => {
    const on = active === key;
    return (
      <div
        className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1"
        style={{
          background: on ? T.primaryFixed : "transparent",
          color: on ? T.primary : T.onSurfaceVariant,
        }}
      >
        <div className="h-4 w-4">{icon}</div>
        <span className="text-[9px] font-semibold" style={{ fontFamily: FONT_BODY }}>
          {label}
        </span>
      </div>
    );
  };
  return (
    <div
      className="absolute bottom-0 left-0 flex w-full items-center justify-around px-4 pb-3 pt-2"
      style={{
        background: T.surface,
        borderTop: `1px solid ${T.outline}`,
        boxShadow: "0 -4px 20px rgba(22,52,40,0.05)",
      }}
    >
      {item(
        "explore",
        "Explore",
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2 5-5 2 2-5 5-2z" /></svg>,
      )}
      {item(
        "trips",
        "My Trips",
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M6 7v13h12V7M9 7V4h6v3" /></svg>,
      )}
      {item(
        "profile",
        "Profile",
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>,
      )}
    </div>
  );
}

function AppHeader({ title, back = false }: { title: string; back?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 pt-1 pb-2">
      {back ? (
        <button className="flex h-7 w-7 items-center justify-center rounded-full" style={{ color: T.primary }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      ) : (
        <div className="h-7 w-7" />
      )}
      <h1 className="text-[14px] font-semibold tracking-tight" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
        {title}
      </h1>
      <div className="h-7 w-7" />
    </div>
  );
}

function ScreenShell({
  children,
  showNav = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: T.bg, fontFamily: FONT_BODY, color: T.onSurface }}
    >
      <DynamicIsland />
      <StatusBar />
      <div className={`relative ${showNav ? "pb-16" : ""} h-[calc(100%-24px)] overflow-hidden`}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}

/* ---------------- Screens ---------------- */

// 1) Discovery
function DiscoveryScreen() {
  return (
    <ScreenShell>
      <div className="flex items-center justify-between px-5 pt-1">
        <div className="h-6 w-6 rounded-full" style={{ background: T.primaryFixed }} />
        <span className="text-[16px] font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          OwnWay
        </span>
        <div className="h-6 w-6" />
      </div>

      <div className="px-5 pt-4">
        <h2 className="text-[20px] leading-tight font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          Where to next?
        </h2>
        <div
          className="mt-3 flex items-center gap-2 rounded-full px-3 py-2"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.onSurfaceVariant} strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <span className="text-[11px]" style={{ color: T.onSurfaceVariant }}>
            Search destinations, guides, styles…
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Slow Travel", "Local Food", "Art & Culture", "Nature"].map((c, i) => (
            <span
              key={c}
              className="rounded-full px-2.5 py-1 text-[10px] font-medium"
              style={{
                background: i === 0 ? T.secondaryContainer : T.surfaceHigh,
                color: i === 0 ? T.secondary : T.onSurfaceVariant,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        <h3 className="text-[13px] font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          Curated Journeys
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div
            className="col-span-2 relative h-28 overflow-hidden rounded-xl"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />
            <div className="absolute bottom-2 left-3 text-white">
              <div className="text-[9px] uppercase tracking-widest opacity-90">Japan</div>
              <div className="text-[18px] leading-none" style={{ fontFamily: FONT_HEAD, fontWeight: 700 }}>
                Kyoto
              </div>
            </div>
          </div>
          {[
            {
              city: "Florence",
              country: "Italy",
              img: "https://images.unsplash.com/photo-1541370545-ba1c8f4dc7c6?auto=format&fit=crop&w=600&q=80",
            },
            {
              city: "Lisbon",
              country: "Portugal",
              img: "https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=600&q=80",
            },
          ].map((c) => (
            <div
              key={c.city}
              className="relative h-20 overflow-hidden rounded-xl"
              style={{ backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />
              <div className="absolute bottom-1.5 left-2 text-white">
                <div className="text-[8px] uppercase tracking-widest opacity-90">{c.country}</div>
                <div className="text-[13px]" style={{ fontFamily: FONT_HEAD, fontWeight: 700 }}>
                  {c.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

// 2) Destination
function DestinationScreen() {
  const options = [
    { name: "Florence", country: "Italy", tag: "Popular" },
    { name: "Kyoto", country: "Japan", tag: "Trending" },
    { name: "Lisbon", country: "Portugal" },
    { name: "Marrakech", country: "Morocco" },
    { name: "Oaxaca", country: "Mexico" },
  ];
  return (
    <ScreenShell>
      <AppHeader title="New Trip" back />
      <div className="px-5">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: T.accent }}>
          Step 1 of 4
        </p>
        <h2 className="mt-1 text-[20px] leading-tight font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          Where are you going?
        </h2>
        <div
          className="mt-3 flex items-center gap-2 rounded-full px-3 py-2"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.onSurfaceVariant} strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <span className="text-[11px]" style={{ color: T.onSurfaceVariant }}>
            Search a city or region
          </span>
        </div>
        <div className="mt-3 space-y-1.5">
          {options.map((o, i) => (
            <div
              key={o.name}
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{
                background: i === 0 ? T.primaryFixed : T.surface,
                border: `1px solid ${i === 0 ? T.primary : T.outline}`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: T.surfaceHigh, color: T.primary }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[12px] font-semibold" style={{ color: T.primary }}>
                    {o.name}
                  </div>
                  <div className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
                    {o.country}
                  </div>
                </div>
              </div>
              {o.tag && (
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                  style={{ background: T.secondaryContainer, color: T.secondary }}
                >
                  {o.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-16 left-0 w-full px-5 pb-2">
        <button
          className="w-full rounded-full py-2.5 text-[12px] font-semibold text-white"
          style={{ background: T.primary }}
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

// 3) Dates
function DatesScreen() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // include padding
  const selectedStart = 12;
  const selectedEnd = 19;
  return (
    <ScreenShell>
      <AppHeader title="New Trip" back />
      <div className="px-5">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: T.accent }}>
          Step 2 of 4
        </p>
        <h2 className="mt-1 text-[20px] leading-tight font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          When are you traveling?
        </h2>
        <div className="mt-3 flex items-center justify-between text-[11px]" style={{ color: T.primary }}>
          <span className="font-semibold">May 2026</span>
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full" style={{ background: T.surfaceHigh }} />
            <div className="h-6 w-6 rounded-full" style={{ background: T.surfaceHigh }} />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[9px]" style={{ color: T.onSurfaceVariant }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="py-1 font-semibold">
              {d}
            </div>
          ))}
          {days.map((d, i) => {
            const valid = d > 0 && d <= 31;
            const inRange = valid && d >= selectedStart && d <= selectedEnd;
            const isEnd = d === selectedStart || d === selectedEnd;
            return (
              <div key={i} className="flex items-center justify-center">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px]"
                  style={{
                    background: isEnd ? T.primary : inRange ? T.primaryFixed : "transparent",
                    color: isEnd ? "#fff" : valid ? T.onSurface : "transparent",
                    fontWeight: isEnd ? 700 : 500,
                  }}
                >
                  {valid ? d : ""}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          <div className="flex items-center justify-between text-[11px]">
            <div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: T.onSurfaceVariant }}>
                Check-in
              </div>
              <div className="font-semibold" style={{ color: T.primary }}>
                Tue, May 12
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-widest" style={{ color: T.onSurfaceVariant }}>
                Check-out
              </div>
              <div className="font-semibold" style={{ color: T.primary }}>
                Tue, May 19
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 left-0 w-full px-5 pb-2">
        <button
          className="w-full rounded-full py-2.5 text-[12px] font-semibold text-white"
          style={{ background: T.primary }}
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

// 4) Style
function StyleScreen() {
  const styles = [
    { name: "Slow & local", desc: "Neighborhoods, cafés, quiet mornings", on: true },
    { name: "Food-first", desc: "Markets, tastings, chef picks" },
    { name: "Art & culture", desc: "Museums, studios, live music" },
    { name: "Outdoors", desc: "Trails, coast, small towns" },
  ];
  return (
    <ScreenShell>
      <AppHeader title="New Trip" back />
      <div className="px-5">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: T.accent }}>
          Step 3 of 4
        </p>
        <h2 className="mt-1 text-[20px] leading-tight font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          What's your style?
        </h2>
        <div className="mt-3 space-y-1.5">
          {styles.map((s) => (
            <div
              key={s.name}
              className="flex items-start gap-2.5 rounded-xl p-3"
              style={{
                background: s.on ? T.primaryFixed : T.surface,
                border: `1px solid ${s.on ? T.primary : T.outline}`,
              }}
            >
              <div
                className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  background: s.on ? T.primary : "transparent",
                  border: `1.5px solid ${s.on ? T.primary : T.outline}`,
                }}
              >
                {s.on && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-[12px] font-semibold" style={{ color: T.primary }}>
                  {s.name}
                </div>
                <div className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-16 left-0 w-full px-5 pb-2">
        <button
          className="w-full rounded-full py-2.5 text-[12px] font-semibold text-white"
          style={{ background: T.primary }}
        >
          Continue
        </button>
      </div>
    </ScreenShell>
  );
}

// 5) Summary / Finding WayMakers
function FindingScreen() {
  return (
    <ScreenShell>
      <AppHeader title="New Trip" back />
      <div className="px-5">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: T.accent }}>
          Step 4 of 4
        </p>
        <h2 className="mt-1 text-[18px] leading-tight font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          Finding WayMakers for Florence
        </h2>
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          {[
            ["Destination", "Florence, Italy"],
            ["Dates", "May 12 – 19, 2026"],
            ["Style", "Slow & local"],
            ["Travelers", "2 adults"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b py-1.5 text-[11px] last:border-0" style={{ borderColor: T.outline }}>
              <span style={{ color: T.onSurfaceVariant }}>{k}</span>
              <span className="font-semibold" style={{ color: T.primary }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="relative h-14 w-14">
            <div
              className="absolute inset-0 animate-spin rounded-full"
              style={{
                border: `3px solid ${T.primaryFixed}`,
                borderTopColor: T.primary,
                animationDuration: "1.2s",
              }}
            />
          </div>
          <p className="mt-3 text-center text-[11px]" style={{ color: T.onSurfaceVariant }}>
            Matching you with locals who know Florence deeply…
          </p>
          <div className="mt-2 flex -space-x-1.5">
            {["#F7BE8A", "#C8EAD8", "#FFDCBD", "#E26F4F"].map((c) => (
              <div key={c} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

// 6) Suggested WayMakers
function WayMakersScreen() {
  const people = [
    { name: "Elara V.", tag: "Slow travel · Art", years: "12 yrs in Florence", rating: "4.9" },
    { name: "Marco B.", tag: "Food · Wine", years: "Born & raised", rating: "5.0" },
    { name: "Sofia R.", tag: "Family · Culture", years: "8 yrs local", rating: "4.9" },
  ];
  return (
    <ScreenShell>
      <AppHeader title="Suggested WayMakers" back />
      <div className="px-5">
        <p className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
          For your Florence trip · May 12 – 19
        </p>
        <div className="mt-3 space-y-2">
          {people.map((p, i) => (
            <div
              key={p.name}
              className="rounded-xl p-3"
              style={{ background: T.surface, border: `1px solid ${T.outline}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-11 w-11 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${
                      i === 0 ? "#F7BE8A" : i === 1 ? "#C8EAD8" : "#FFDCBD"
                    }, ${T.primaryFixed})`,
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold" style={{ color: T.primary }}>
                      {p.name}
                    </div>
                    <div className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: T.secondary }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3 6.5 7 .8-5.3 4.7 1.6 7L12 17.4 5.7 21l1.6-7L2 9.3l7-.8L12 2z" />
                      </svg>
                      {p.rating}
                    </div>
                  </div>
                  <div className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
                    {p.tag}
                  </div>
                  <div className="mt-0.5 text-[10px]" style={{ color: T.onSurfaceVariant }}>
                    {p.years}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex gap-1.5">
                <button
                  className="flex-1 rounded-full py-1.5 text-[10px] font-semibold"
                  style={{ background: T.primary, color: "#fff" }}
                >
                  Send a note
                </button>
                <button
                  className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
                  style={{ background: T.surfaceHigh, color: T.primary }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

// 7) My Trips dashboard
function MyTripsScreen() {
  return (
    <ScreenShell>
      <div className="flex items-center justify-between px-5 pt-1">
        <h1 className="text-[18px] font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
          My Trips
        </h1>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: T.primary, color: "#fff" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>

      <div className="px-5 pt-3">
        <div className="flex gap-1.5 text-[10px] font-semibold">
          <span className="rounded-full px-2.5 py-1" style={{ background: T.primary, color: "#fff" }}>
            Upcoming
          </span>
          <span className="rounded-full px-2.5 py-1" style={{ background: T.surfaceHigh, color: T.onSurfaceVariant }}>
            Planning
          </span>
          <span className="rounded-full px-2.5 py-1" style={{ background: T.surfaceHigh, color: T.onSurfaceVariant }}>
            Past
          </span>
        </div>

        <div
          className="mt-3 overflow-hidden rounded-xl"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          <div
            className="h-24"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1541370545-ba1c8f4dc7c6?auto=format&fit=crop&w=800&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-widest" style={{ color: T.accent }}>
                  Confirmed
                </div>
                <div className="text-[14px] font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
                  Florence, Italy
                </div>
                <div className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
                  May 12 – 19 · with Elara V.
                </div>
              </div>
              <div className="flex -space-x-1.5">
                <div className="h-6 w-6 rounded-full border-2 border-white" style={{ background: T.accentSoft }} />
                <div className="h-6 w-6 rounded-full border-2 border-white" style={{ background: T.primaryFixed }} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-2 rounded-xl p-3"
          style={{ background: T.surface, border: `1px solid ${T.outline}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: T.secondary }}>
                In planning
              </div>
              <div className="text-[13px] font-semibold" style={{ fontFamily: FONT_HEAD, color: T.primary }}>
                Kyoto, Japan
              </div>
              <div className="text-[10px]" style={{ color: T.onSurfaceVariant }}>
                Waiting on 2 WayMakers
              </div>
            </div>
            <div
              className="rounded-full px-2 py-1 text-[9px] font-semibold"
              style={{ background: T.secondaryContainer, color: T.secondary }}
            >
              Draft
            </div>
          </div>
        </div>

        <div
          className="mt-2 flex items-center gap-2 rounded-xl p-3"
          style={{ background: T.primaryFixed, color: T.primary }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "#fff" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2">
              <path d="M12 2l3 6.5 7 .8-5.3 4.7 1.6 7L12 17.4 5.7 21l1.6-7L2 9.3l7-.8L12 2z" />
            </svg>
          </div>
          <div className="text-[10px] font-semibold leading-snug">
            Rate your recent trip to Lisbon and help other travelers.
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ---------------- Export ---------------- */

export const APP_SCREENS: { key: string; label: string; render: () => React.ReactNode }[] = [
  { key: "discovery", label: "Discover", render: () => <DiscoveryScreen /> },
  { key: "destination", label: "Destination", render: () => <DestinationScreen /> },
  { key: "dates", label: "Dates", render: () => <DatesScreen /> },
  { key: "style", label: "Style", render: () => <StyleScreen /> },
  { key: "finding", label: "Summary", render: () => <FindingScreen /> },
  { key: "waymakers", label: "WayMakers", render: () => <WayMakersScreen /> },
  { key: "trips", label: "My Trips", render: () => <MyTripsScreen /> },
];
