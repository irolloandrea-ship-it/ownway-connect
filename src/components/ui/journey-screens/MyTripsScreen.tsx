import { Calendar, CheckCircle2, ChevronRight, Clock, Compass, Menu, Plus, Sparkles } from "lucide-react";
import { APP } from "./palette";
import { MY_JOURNEYS } from "./data";
import { ScreenShell, TabBar } from "./shell";

export function MyTripsScreen() {
  const upcoming = MY_JOURNEYS.filter((j) => j.status !== "past");
  const past = MY_JOURNEYS.filter((j) => j.status === "past");

  return (
    <ScreenShell footer={<TabBar active="trips" />}>
      <div className="space-y-4">
        <Menu className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
            My Journeys
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: APP.inkMuted }}>
            Upcoming adventures and past memories curated by your WayMakers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4" style={{ color: APP.green }} aria-hidden />
          <h2 className="font-display text-lg font-bold" style={{ color: APP.green }}>
            Upcoming
          </h2>
        </div>

        <div className="space-y-3">
          {upcoming.map((journey) => (
            <div
              key={journey.id}
              className="space-y-3 rounded-3xl p-4"
              style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
            >
              <div className="relative h-[118px] overflow-hidden rounded-2xl">
                <img
                  src={journey.image}
                  alt={`${journey.city}, ${journey.country}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                  <span
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
                    style={{
                      background: journey.status === "ready" ? `${APP.greenSoft}e6` : `${APP.clay}e6`,
                    }}
                  >
                    {journey.status === "ready" ? (
                      <CheckCircle2 className="h-3 w-3" style={{ color: APP.greenTint }} />
                    ) : (
                      <Sparkles className="h-3 w-3" style={{ color: APP.apricot }} />
                    )}
                    {journey.status === "ready" ? "Itinerary Ready" : "Finding Matches"}
                  </span>

                  {journey.curatedBy && (
                    <span
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{ background: "rgba(255,255,255,0.95)", color: APP.ink }}
                    >
                      <img
                        src={journey.curatedBy.avatar}
                        alt=""
                        className="h-3.5 w-3.5 rounded-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                      Curated by {journey.curatedBy.name}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-2xl font-bold text-white">{journey.city}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                    <Calendar className="h-3 w-3" />
                    <span>{journey.dates}</span>
                  </div>
                </div>
              </div>

              {journey.status === "matching" ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]" style={{ color: APP.inkFaint }}>
                    <span>Reviewing local WayMakers…</span>
                    <span className="font-bold">{journey.matchProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: APP.line }}>
                    <div
                      className="h-full rounded-full"
                      style={{ background: APP.clay, width: `${journey.matchProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {journey.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ background: APP.chip, color: APP.inkMuted }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div
            className="flex items-center gap-3 rounded-2xl p-3.5"
            style={{ background: APP.green, color: "#fff" }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", color: APP.greenTint }}
              aria-hidden
            >
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-bold text-white">Plan a new trip</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Clock className="h-4 w-4" style={{ color: APP.inkFaint }} aria-hidden />
          <h2 className="font-display text-lg font-bold" style={{ color: APP.green }}>
            Past Journeys
          </h2>
        </div>

        <div className="space-y-2">
          {past.slice(0, 1).map((journey) => (
            <div
              key={journey.id}
              className="flex items-center justify-between gap-3 rounded-2xl p-3"
              style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={journey.image}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                  draggable={false}
                />
                <div className="min-w-0">
                  <h4 className="truncate font-display text-sm font-bold" style={{ color: APP.green }}>
                    {journey.city}, {journey.country}
                  </h4>
                  <p className="text-[11px]" style={{ color: APP.inkFaint }}>
                    {journey.dates}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0" style={{ color: APP.inkFaint }} aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
