import { ArrowLeft, CheckCircle2, Compass, Sparkles } from "lucide-react";
import { APP } from "./palette";
import { PrimaryBar, ScreenShell } from "./shell";

const MATCH_CHIPS = ["Relaxed Pace", "Local Wine", "Art History"];

export function ConnectingScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="View Suggested Experts" />}>
      <div className="flex h-full flex-col">
        <ArrowLeft className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <div className="my-auto space-y-6 py-8 text-center">
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center" aria-hidden>
            <div className="ow-pulse-glow absolute inset-0 rounded-full" style={{ background: `${APP.green}1a` }} />
            <div
              className="ow-pulse-glow absolute inset-3 rounded-full"
              style={{ background: `${APP.clay}1a`, animationDelay: "0.4s" }}
            />
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: APP.green }}
            >
              <Compass
                className="ow-slow-spin h-10 w-10"
                style={{ color: APP.apricot }}
              />
            </div>
          </div>

          <div className="mx-auto max-w-[280px] space-y-2">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: APP.clayTint, color: APP.clay }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Connecting WayMakers</span>
            </div>

            <h2 className="font-display text-2xl font-bold" style={{ color: APP.green }}>
              Finding your local experts in Florence…
            </h2>

            <p className="text-xs leading-relaxed" style={{ color: APP.inkFaint }}>
              Curating local hosts who specialise in slow travel, Renaissance art and artisan workshops.
            </p>
          </div>

          <div className="mx-auto flex max-w-[280px] flex-wrap justify-center gap-2 pt-2">
            {MATCH_CHIPS.map((chip) => (
              <span
                key={chip}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium"
                style={{ background: APP.chip, color: APP.inkMuted }}
              >
                <CheckCircle2 className="h-3 w-3" style={{ color: APP.green }} />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
