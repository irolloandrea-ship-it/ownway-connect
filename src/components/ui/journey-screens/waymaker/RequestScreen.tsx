import { CalendarDays, Handshake, MapPin, Users } from "lucide-react";
import { APP } from "../palette";
import { ScreenShell, PrimaryBar } from "../shell";
import { WM_REQUEST } from "../waymaker-data";

export function WmRequestScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Review request & draft tips" />}>
      <div className="flex h-full flex-col justify-center">
        <div
          className="space-y-5 rounded-3xl p-5"
          style={{ background: APP.surface, border: `1px solid ${APP.border}`, boxShadow: "0 20px 40px rgba(22,52,40,0.06)" }}
        >
          <div className="space-y-3 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium"
              style={{ background: APP.clayTint, color: APP.clay }}
            >
              <Handshake className="h-4 w-4" />
              Thoughtfully matched
            </span>
            <h2 className="font-display text-[26px] font-bold leading-tight" style={{ color: APP.green }}>
              Someone is planning {WM_REQUEST.city} your way.
            </h2>
          </div>

          <div
            className="space-y-4 rounded-2xl p-4"
            style={{ background: APP.bg, border: `1px solid ${APP.border}` }}
          >
            <div className="flex flex-wrap gap-2">
              {WM_REQUEST.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-3 py-1 text-xs font-semibold"
                  style={{ background: APP.chip, color: APP.green }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-3 text-sm" style={{ color: APP.inkMuted }}>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" style={{ color: APP.green }} />
                <span>{WM_REQUEST.travelersCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5" style={{ color: APP.green }} />
                <span>{WM_REQUEST.dates}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" style={{ color: APP.green }} />
                <span>
                  {WM_REQUEST.city}, {WM_REQUEST.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
