import { MapPin, Menu, Search } from "lucide-react";
import { APP } from "./palette";
import { CATEGORY_TAGS, DESTINATIONS } from "./data";
import { ScreenShell, TabBar } from "./shell";

export function ExploreScreen() {
  return (
    <ScreenShell footer={<TabBar active="explore" />}>
      <div className="space-y-5">
        <Menu className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
          Where to next?
        </h1>

        <div className="relative" aria-hidden>
          <Search className="absolute left-4 top-3.5 h-5 w-5" style={{ color: APP.inkFaint }} />
          <div
            className="w-full rounded-full py-3 pl-12 pr-4 text-sm"
            style={{ background: APP.surface, border: `1px solid ${APP.border}`, color: APP.inkFaint }}
          >
            Search destinations or styles…
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-hidden" aria-hidden>
          {CATEGORY_TAGS.map((tag, i) => (
            <span
              key={tag}
              className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium"
              style={
                i === 0
                  ? { background: APP.clayTint, color: APP.clay, fontWeight: 600 }
                  : { background: APP.chip, color: APP.inkMuted }
              }
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold" style={{ color: APP.green }}>
          Curated Journeys
        </h2>

        <div className="space-y-4">
          {DESTINATIONS.slice(0, 2).map((dest) => (
            <div key={dest.id} className="relative h-[196px] overflow-hidden rounded-2xl">
              <img
                src={dest.image}
                alt={`${dest.name}, ${dest.country.toLowerCase()}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1 text-white">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/90">
                  <MapPin className="h-3.5 w-3.5" style={{ color: APP.apricot }} />
                  <span>{dest.country}</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-white">{dest.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
