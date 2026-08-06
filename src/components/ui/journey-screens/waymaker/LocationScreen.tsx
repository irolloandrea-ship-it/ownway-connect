import { Check, Search } from "lucide-react";
import { APP } from "../palette";
import { ScreenShell, PrimaryBar } from "../shell";
import { WM_CITIES } from "../waymaker-data";

export function WmLocationScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Continue" />}>
      <div className="space-y-5">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
            Where do you know best?
          </h1>
          <p className="text-base" style={{ color: APP.inkMuted }}>
            Tell us the city you've truly made your own.
          </p>
        </div>

        <div className="relative" aria-hidden>
          <Search className="absolute left-4 top-3.5 h-5 w-5" style={{ color: APP.inkFaint }} />
          <div
            className="w-full rounded-full py-3 pl-12 pr-4 text-sm"
            style={{ background: APP.surface, border: `1px solid ${APP.border}`, color: APP.ink }}
          >
            Florence, Italy
          </div>
        </div>

        <div className="space-y-3">
          {WM_CITIES.map((city, i) => {
            const selected = i === 0;
            return (
              <div
                key={city.id}
                className="flex items-center gap-4 rounded-2xl p-3"
                style={{
                  background: APP.surface,
                  border: `1px solid ${selected ? APP.green : APP.border}`,
                  boxShadow: selected ? "0 12px 26px rgba(22,52,40,0.08)" : "none",
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div className="flex-1">
                  <div className="font-display text-xl font-semibold" style={{ color: APP.green }}>
                    {city.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-widest" style={{ color: APP.inkFaint }}>
                    {city.country}
                  </div>
                </div>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={
                    selected
                      ? { background: APP.green, color: "#fff" }
                      : { border: `1px solid ${APP.border}`, color: "transparent" }
                  }
                >
                  <Check className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
