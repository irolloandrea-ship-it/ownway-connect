import { BookOpen, CalendarDays, Map } from "lucide-react";
import { APP } from "../palette";
import { ScreenShell, PrimaryBar, StepProgress } from "../shell";
import { WM_GUIDANCE, WM_SELECTED_GUIDANCE } from "../waymaker-data";

const ICONS = { tips: Map, stories: BookOpen, itineraries: CalendarDays } as const;

export function WmGuidanceScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Continue" />}>
      <div className="space-y-6">
        <StepProgress step="Step 3 of 3" label="Your style" width="100%" />

        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
          How do you like to help?
        </h1>

        <div className="space-y-3">
          {WM_GUIDANCE.map((option) => {
            const Icon = ICONS[option.id as keyof typeof ICONS];
            const selected = WM_SELECTED_GUIDANCE.includes(option.title);
            return (
              <div
                key={option.id}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{
                  background: selected ? APP.surfaceMuted : APP.surface,
                  border: `1px solid ${selected ? APP.green : APP.border}`,
                  boxShadow: selected ? "0 12px 26px rgba(22,52,40,0.08)" : "none",
                }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={
                    selected
                      ? { background: APP.greenSoft, color: "#fff" }
                      : { background: APP.chip, color: APP.green }
                  }
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold" style={{ color: APP.ink }}>
                    {option.title}
                  </div>
                  <div className="mt-0.5 text-sm" style={{ color: APP.inkMuted }}>
                    {option.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
