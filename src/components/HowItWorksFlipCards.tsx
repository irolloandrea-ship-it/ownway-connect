import { HeartHandshake, MessageCircle, Search, Send, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ConnectingScreen } from "@/components/ui/journey-screens/ConnectingScreen";
import { ExploreScreen } from "@/components/ui/journey-screens/ExploreScreen";
import { FLORENCE_WAYMAKERS } from "@/components/ui/journey-screens/data";
import { APP } from "@/components/ui/journey-screens/palette";
import { ScreenShell, TabBar } from "@/components/ui/journey-screens/shell";

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 884;

type Step = {
  label: string;
  title: string;
  icon: LucideIcon;
  Screen: () => React.JSX.Element;
};

function AdviceScreen() {
  const isabella = FLORENCE_WAYMAKERS[0];

  return (
    <ScreenShell footer={<TabBar active="explore" />}>
      <div className="space-y-4">
        <div className="relative h-[290px] overflow-hidden rounded-3xl">
          <img
            src={isabella.image}
            alt="Isabella Rossi, WayMaker a Firenze"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div
            className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: APP.surface, color: APP.ink }}
          >
            <Star className="size-3.5 fill-current" style={{ color: APP.clay }} />
            4.9 <span style={{ color: APP.inkFaint }}>(150+)</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: APP.green }}>
            Isabella Rossi
          </h2>
          <p className="mt-1 text-xs font-semibold" style={{ color: APP.clay }}>
            Esperta in Arte Rinascimentale e trattorie nascoste
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Storia dell’arte", "Cucina locale", "Luoghi segreti"].map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
              style={{ background: APP.clayTint, color: APP.clay }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          className="rounded-2xl p-4 text-xs italic leading-relaxed"
          style={{ background: APP.surfaceMuted, color: APP.ink }}
        >
          “Ti mostro una Firenze autentica, fatta di storie, persone e luoghi che non troveresti sulle guide.”
        </p>

        <div
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold"
          style={{ background: APP.green, color: APP.bg }}
        >
          Scrivi a Isabella <Send className="size-4" aria-hidden />
        </div>
      </div>
    </ScreenShell>
  );
}

const STEPS: Step[] = [
  { label: "PASSAGGIO 1", title: "Parti da quello che cerchi", icon: Search, Screen: ExploreScreen },
  { label: "PASSAGGIO 2", title: "Troviamo la persona locale giusta", icon: HeartHandshake, Screen: ConnectingScreen },
  { label: "PASSAGGIO 3", title: "Ricevi consigli su misura", icon: MessageCircle, Screen: AdviceScreen },
];

function PhoneMockup({ Screen, label }: { Screen: Step["Screen"]; label: string }) {
  return (
    <div className="relative mx-auto w-[248px] sm:w-[270px] lg:w-[260px] xl:w-[280px]" role="img" aria-label={label}>
      <div className="absolute -left-[3px] top-[82px] h-8 w-[3px] rounded-l-sm bg-foreground/80" aria-hidden />
      <div className="absolute -left-[3px] top-[130px] h-14 w-[3px] rounded-l-sm bg-foreground/80" aria-hidden />
      <div className="absolute -right-[3px] top-[150px] h-20 w-[3px] rounded-r-sm bg-foreground/80" aria-hidden />

      <div className="aspect-[390/884] overflow-hidden rounded-[2.9rem] border-[5px] border-foreground bg-foreground shadow-warm">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-background">
          <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground" aria-hidden />
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              transform: "scale(calc((var(--phone-width, 248px) - 10px) / 390))",
            }}
          >
            <Screen />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksFlipCards() {
  return (
    <section id="how-it-works" className="border-t border-border/60 py-20 md:py-28">
      <div className="container-page">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">COME FUNZIONA</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl leading-tight md:text-5xl">
          Da ore di ricerca a 3 semplici passaggi.
        </h2>

        <ol className="mx-auto mt-14 grid max-w-6xl items-start gap-x-6 gap-y-20 md:grid-cols-3 lg:gap-x-8">
          {STEPS.map(({ label, title, icon: Icon, Screen }) => (
            <li key={label} className="grid grid-rows-[9.5rem_auto] justify-items-center gap-10 [--phone-width:248px] sm:[--phone-width:270px] lg:[--phone-width:260px] xl:[--phone-width:280px]">
              <div className="h-full w-full rounded-2xl border border-border/70 bg-card/90 p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary/50 text-foreground">
                    <Icon className="size-4" strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
                </div>
                <h3 className="mt-4 text-2xl leading-[1.15] text-foreground">{title}</h3>
              </div>
              <PhoneMockup Screen={Screen} label={`Schermata OwnWay: ${title}`} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}