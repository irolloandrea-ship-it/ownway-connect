import { CalendarDays, NotebookPen } from "lucide-react";
import { APP } from "../palette";
import { ScreenShell, PrimaryBar } from "../shell";
import { WM_REQUEST } from "../waymaker-data";

export function WmShareWisdomScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Send your suggestions" />}>
      <div className="space-y-4">
        <div className="relative -mx-5 -mt-16 h-[190px] overflow-hidden">
          <img
            src={WM_REQUEST.hero}
            alt="Florence rooftops at golden hour"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${APP.bg}, ${APP.bg}66, transparent)` }}
          />
        </div>

        <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight" style={{ color: APP.green }}>
          Your local perspective can change their whole trip.
        </h1>

        <div
          className="space-y-4 rounded-2xl p-4"
          style={{ background: APP.surface, border: `1px solid ${APP.border}`, boxShadow: "0 20px 40px rgba(22,52,40,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <img
              src={WM_REQUEST.travelerAvatar}
              alt={WM_REQUEST.travelerName}
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <div>
              <div className="text-sm font-semibold" style={{ color: APP.ink }}>
                Message from {WM_REQUEST.travelerName}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs font-medium" style={{ color: APP.inkFaint }}>
                <CalendarDays className="h-3.5 w-3.5" />
                {WM_REQUEST.arrivalWindow}
              </div>
            </div>
          </div>

          <p
            className="pl-4 text-sm italic leading-relaxed"
            style={{ color: APP.inkMuted, borderLeft: `3px solid ${APP.greenTint}` }}
          >
            {WM_REQUEST.message}
          </p>

          <div className="h-px w-full" style={{ background: APP.line }} />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: APP.ink }}>
              <NotebookPen className="h-4 w-4" style={{ color: APP.green }} />
              Your drafted suggestions
            </div>
            <ul className="space-y-2.5">
              {WM_REQUEST.suggestions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: APP.ink }}>
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: APP.green }}
                  />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
