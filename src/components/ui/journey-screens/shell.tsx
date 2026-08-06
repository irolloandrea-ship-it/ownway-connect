import * as React from "react";
import { Compass, MapPin, User } from "lucide-react";
import { APP } from "./palette";

/**
 * Shared frame-safe shell for the in-phone preview screens.
 * Every screen renders on a fixed 390×884 design canvas that the carousel
 * scales into the phone viewport — so nothing clips, scrolls, or uses 100vh.
 * Top padding keeps content clear of the Dynamic Island.
 */
export function ScreenShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="ow-screen-fade flex h-full w-full select-none flex-col justify-between overflow-hidden px-5 pb-5 pt-16 font-sans"
      style={{ background: APP.bg, color: APP.ink }}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
      {footer ? (
        <div
          className="shrink-0 pt-3"
          style={{ borderTop: `1px solid ${APP.line}`, background: APP.bg }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function PrimaryBar({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="w-full rounded-2xl py-3.5 text-center text-sm font-semibold text-white"
      style={{ background: APP.green }}
    >
      {label}
    </div>
  );
}

export function StepProgress({ step, label, width }: { step: string; label: string; width: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-medium" style={{ color: APP.inkFaint }}>
        <span>{step}</span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: APP.line }}>
        <div className="h-full rounded-full" style={{ background: APP.green, width }} />
      </div>
    </div>
  );
}

export function TabBar({ active }: { active: "explore" | "trips" | "profile" }) {
  const items = [
    { key: "explore", label: "Explore", Icon: Compass },
    { key: "trips", label: "My Trips", Icon: MapPin },
    { key: "profile", label: "Profile", Icon: User },
  ] as const;
  return (
    <div aria-hidden className="flex items-center justify-around py-1">
      {items.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <div
            key={key}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
            style={
              isActive
                ? { background: APP.green, color: "#fff" }
                : { color: APP.inkMuted }
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
