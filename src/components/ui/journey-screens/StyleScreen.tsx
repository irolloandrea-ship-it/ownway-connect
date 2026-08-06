import { ArrowLeft, Check, Compass, Landmark, Sparkles, Users } from "lucide-react";
import { APP } from "./palette";
import { SELECTED_STYLES, TRAVEL_STYLES } from "./data";
import { PrimaryBar, ScreenShell, StepProgress } from "./shell";

const ICONS = {
  relaxed: Sparkles,
  adventurous: Compass,
  family: Users,
  culture: Landmark,
} as const;

export function StyleScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Continue" />}>
      <div className="space-y-5">
        <ArrowLeft className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <StepProgress step="Step 3 of 3" label="Travel Style" width="100%" />

        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold" style={{ color: APP.green }}>
            What's your travel style?
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: APP.inkMuted }}>
            Select all that apply — we'll match you with WayMakers who share your vibe.
          </p>
        </div>

        <div className="space-y-3">
          {TRAVEL_STYLES.map((style) => {
            const Icon = ICONS[style.icon];
            const isSelected = SELECTED_STYLES.includes(style.id);
            return (
              <div
                key={style.id}
                className="space-y-2 rounded-2xl p-4"
                style={{
                  background: APP.surface,
                  border: `1px solid ${isSelected ? APP.green : APP.chip}`,
                  boxShadow: isSelected ? `0 0 0 1px ${APP.green}22` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ background: APP.surfaceMuted }}
                    >
                      <Icon className="h-5 w-5" style={{ color: APP.green }} />
                    </div>
                    <h3 className="truncate font-display text-base font-bold" style={{ color: APP.green }}>
                      {style.label}
                    </h3>
                  </div>
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={
                      isSelected
                        ? { background: APP.green, border: `1px solid ${APP.green}`, color: "#fff" }
                        : { border: `1px solid ${APP.border}` }
                    }
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: APP.inkMuted }}>
                  {style.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
