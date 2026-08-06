import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { APP } from "./palette";
import { PrimaryBar, ScreenShell, StepProgress } from "./shell";

const START = 12;
const END = 18;

export function DatesScreen() {
  return (
    <ScreenShell footer={<PrimaryBar label="Continue" />}>
      <div className="space-y-5">
        <ArrowLeft className="h-6 w-6" style={{ color: APP.green }} aria-hidden />

        <StepProgress step="Step 2 of 3" label="Travel Dates" width="66%" />

        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold" style={{ color: APP.green }}>
            When is your journey?
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: APP.inkMuted }}>
            Select your start and end dates for Florence.
          </p>
        </div>

        <div
          className="space-y-4 rounded-3xl p-5"
          style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
        >
          <div className="flex items-center justify-between" aria-hidden>
            <ChevronLeft className="h-5 w-5" style={{ color: APP.green }} />
            <h2 className="font-display text-lg font-bold" style={{ color: APP.green }}>
              September 2024
            </h2>
            <ChevronRight className="h-5 w-5" style={{ color: APP.green }} />
          </div>

          <div
            className="grid grid-cols-7 text-center text-xs font-semibold"
            style={{ color: APP.inkFaint }}
            aria-hidden
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={`${d}-${i}`}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm font-medium">
            {Array.from({ length: 30 }).map((_, idx) => {
              const day = idx + 1;
              const isStart = day === START;
              const isEnd = day === END;
              const inRange = day > START && day < END;
              return (
                <div key={day} className="relative flex h-9 items-center justify-center">
                  {inRange && (
                    <div className="absolute inset-y-1 inset-x-0" style={{ background: APP.clayTint }} />
                  )}
                  {isStart && (
                    <div className="absolute inset-y-1 left-1/2 right-0" style={{ background: APP.clayTint }} />
                  )}
                  {isEnd && (
                    <div className="absolute inset-y-1 left-0 right-1/2" style={{ background: APP.clayTint }} />
                  )}
                  <span
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs"
                    style={
                      isStart || isEnd
                        ? { background: APP.clay, color: "#fff", fontWeight: 700 }
                        : inRange
                          ? { color: APP.clay, fontWeight: 700 }
                          : { color: APP.ink }
                    }
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl p-4"
          style={{ background: APP.surface, border: `1px solid ${APP.chip}` }}
        >
          <div className="space-y-0.5">
            <h4 className="font-display text-sm font-bold" style={{ color: APP.green }}>
              I'm not sure yet
            </h4>
            <p className="text-[11px]" style={{ color: APP.inkFaint }}>
              Skip for now, you can set dates later.
            </p>
          </div>
          <div className="h-6 w-11 rounded-full p-0.5" style={{ background: APP.border }} aria-hidden>
            <div className="h-5 w-5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}
