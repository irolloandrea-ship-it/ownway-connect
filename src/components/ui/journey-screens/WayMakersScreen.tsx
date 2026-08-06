import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import { APP } from "./palette";
import { FLORENCE_WAYMAKERS } from "./data";
import { ScreenShell, TabBar } from "./shell";

export function WayMakersScreen() {
  const [featured, ...rest] = FLORENCE_WAYMAKERS;

  return (
    <ScreenShell footer={<TabBar active="explore" />}>
      <div className="space-y-4">
        <ArrowLeft className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
            Suggested for you in Florence
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: APP.inkMuted }}>
            Based on slow travel, local culinary secrets and Renaissance art.
          </p>
        </div>

        <div
          className="space-y-3 rounded-3xl p-4"
          style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
        >
          <div className="relative h-[180px] overflow-hidden rounded-2xl">
            <img
              src={featured.image}
              alt={`${featured.name}, local WayMaker in Florence`}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div
              className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.92)", color: APP.ink }}
            >
              <Star className="h-3.5 w-3.5" style={{ color: APP.clay, fill: APP.clay }} />
              <span>{featured.rating.toFixed(1)}</span>
              <span style={{ color: APP.inkFaint, fontWeight: 400 }}>({featured.walksCount}+ walks)</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold" style={{ color: APP.green }}>
              {featured.name}
            </h3>
            <p className="text-[11px] font-semibold" style={{ color: APP.clay }}>
              {featured.title}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {featured.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{ background: APP.clayTint, color: APP.clay }}
              >
                {tag}
              </span>
            ))}
          </div>

          <p
            className="rounded-xl p-3 text-[11px] italic leading-relaxed"
            style={{ background: APP.surfaceMuted, borderLeft: `4px solid ${APP.clay}`, color: APP.ink }}
          >
            “{featured.quote}”
          </p>

          <div
            aria-hidden
            className="w-full rounded-xl py-3 text-center text-xs font-semibold text-white"
            style={{ background: APP.green }}
          >
            View Profile
          </div>
        </div>

        {rest.map((wm) => (
          <div
            key={wm.id}
            className="flex items-center justify-between gap-3 rounded-2xl p-3"
            style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={wm.image}
                alt=""
                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                loading="lazy"
                draggable={false}
              />
              <div className="min-w-0">
                <h4 className="truncate font-display text-sm font-bold" style={{ color: APP.green }}>
                  {wm.name}
                </h4>
                <p className="truncate text-[11px]" style={{ color: APP.inkFaint }}>
                  {wm.title}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[11px] font-semibold" style={{ color: APP.ink }}>
              <Star className="h-3 w-3" style={{ color: APP.clay, fill: APP.clay }} />
              {wm.rating.toFixed(1)}
              <ChevronRight className="h-4 w-4" style={{ color: APP.inkFaint }} />
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
}
