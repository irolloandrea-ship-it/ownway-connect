import { CheckCircle2, Sparkles } from "lucide-react";
import { APP } from "../palette";
import { ScreenShell, PrimaryBar } from "../shell";
import { WM_PROFILE } from "../waymaker-data";

export function WmProfileReadyScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="View incoming travel request" />}>
      <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
        <div
          aria-hidden
          className="ow-pulse-glow pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: APP.greenTint, opacity: 0.5 }}
        />

        <div className="relative">
          <img
            src={WM_PROFILE.avatar}
            alt={`${WM_PROFILE.name} portrait`}
            className="relative z-10 h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div
            className="absolute -right-1 -top-1 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
            style={{ color: APP.clay }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: APP.green }}>
            Your WayMaker profile is ready.
          </h1>
          <p className="text-base" style={{ color: APP.inkMuted }}>
            {WM_PROFILE.name} · {WM_PROFILE.city}, {WM_PROFILE.country}
          </p>
        </div>

        <span
          className="relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold"
          style={{ background: APP.greenTint, color: APP.green }}
        >
          <CheckCircle2 className="h-4 w-4" />
          Ready for review
        </span>

        <div
          className="relative z-10 flex w-full flex-wrap justify-center gap-2 rounded-2xl p-4"
          style={{ background: APP.surface, border: `1px solid ${APP.border}` }}
        >
          {WM_PROFILE.expertise.map((exp) => (
            <span
              key={exp}
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: APP.chip, color: APP.green }}
            >
              {exp}
            </span>
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}
