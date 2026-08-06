import { ArrowLeft, Star } from "lucide-react";
import { APP } from "./palette";
import { FLORENCE_WAYMAKERS } from "./data";
import { ScreenShell, TabBar } from "./shell";

export function WayMakersScreen() {
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

        <div className="space-y-4">
          {FLORENCE_WAYMAKERS.map((wm) => (
            <div
              key={wm.id}
              className="space-y-3 rounded-3xl p-4"
              style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
            >
              <div className="relative h-[150px] overflow-hidden rounded-2xl">
                <img
                  src={wm.image}
                  alt={`${wm.name}, local WayMaker in Florence`}
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
                  <span>{wm.rating.toFixed(1)}</span>
                  <span style={{ color: APP.inkFaint, fontWeight: 400 }}>({wm.walksCount}+ walks)</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold" style={{ color: APP.green }}>
                  {wm.name}
                </h3>
                <p className="text-[11px] font-semibold" style={{ color: APP.clay }}>
                  {wm.title}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {wm.tags.map((tag) => (
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
                “{wm.quote}”
              </p>

              <div
                aria-hidden
                className="w-full rounded-xl py-3 text-center text-xs font-semibold text-white"
                style={{ background: APP.green }}
              >
                View Profile
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
