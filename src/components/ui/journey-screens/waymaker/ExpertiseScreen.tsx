import { APP } from "../palette";
import { ScreenShell, PrimaryBar, StepProgress } from "../shell";
import { WM_EXPERTISE, WM_SELECTED_EXPERTISE } from "../waymaker-data";

export function WmExpertiseScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Continue" />}>
      <div className="space-y-6">
        <StepProgress step="Step 2 of 3" label="Your expertise" width="66%" />

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: APP.green }}>
            What do you love sharing?
          </h1>
          <p className="text-base" style={{ color: APP.inkMuted }}>
            Help us understand what you know deeply.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {WM_EXPERTISE.map((label) => {
            const selected = WM_SELECTED_EXPERTISE.includes(label);
            return (
              <span
                key={label}
                className="rounded-full px-5 py-3 text-sm font-semibold"
                style={
                  selected
                    ? { background: APP.greenSoft, color: "#fff", border: `1px solid ${APP.green}` }
                    : { background: APP.surface, color: APP.ink, border: `1px solid ${APP.border}` }
                }
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </ScreenShell>
  );
}
