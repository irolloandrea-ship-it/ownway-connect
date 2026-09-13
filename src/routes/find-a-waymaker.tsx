import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmailCapture } from "@/components/EmailCapture";
import { FloatingCarousel, type FloatingCarouselItem } from "@/components/ui/floating-carousel";
import { useLocale } from "@/lib/use-locale";

export const Route = createFileRoute("/find-a-waymaker")({
  head: () => ({
    meta: [
      { title: "Trova un WayMaker — OwnWay" },
      { name: "description", content: "Trova un WayMaker che conosce la tua destinazione e ricevi consigli pratici e umani per il tuo viaggio." },
      { property: "og:title", content: "Trova un WayMaker — OwnWay" },
      { property: "og:description", content: "Ricevi consigli di viaggio personali da un WayMaker locale che conosce la tua destinazione." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ownway.app/find-a-waymaker" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ownway.app/find-a-waymaker" }],
  }),
  component: FindAWayMakerPage,
});

type CardCopy = Omit<FloatingCarouselItem, "icon">;

const COPY = {
  it: {
    eyebrow: "Per i viaggiatori",
    title: "Trova un WayMaker che conosce davvero il posto.",
    subtitle:
      "Selezioniamo con cura il WayMaker più adatto alla tua destinazione, al tuo stile di viaggio e alle tue aspettative.",
    asideEyebrow: "Accesso anticipato",
    asideTitle: "Iscriviti come viaggiatore",
    asideSubtitle: "Sarai tra i primi a essere abbinato a un WayMaker per il tuo prossimo viaggio.",
    cards: [
      {
        id: "stop-searching",
        eyebrow: "Basta cercare",
        title: "Smetti di saltare da un contenuto di viaggio all'altro.",
        description:
          "Lascia perdere Instagram, TikTok, blog e liste casuali. Concentrati su consigli che si adattano davvero al tuo viaggio.",
        bullets: [
          "Meno tempo a confrontare consigli casuali",
          "Meno raccomandazioni generiche",
          "Più chiarezza prima di partire",
        ],
      },
      {
        id: "human-advice",
        eyebrow: "Consigli umani",
        title: "Ricevi consigli da chi conosce la destinazione.",
        description:
          "Un WayMaker conosce il posto — perché ci vive, lo visita spesso o ci lavora.",
        bullets: [
          "Consigli locali sui tempi giusti",
          "Raccomandazioni pratiche",
          "Luoghi nascosti e itinerari più intelligenti",
        ],
      },
      {
        id: "your-trip",
        eyebrow: "Il tuo viaggio",
        title: "Consigli che si adattano al tuo stile di viaggio.",
        description:
          "Dicci dove vai e come ti piace viaggiare. Ti abbineremo al WayMaker giusto per te.",
        bullets: [
          "Cibo, cultura, natura, vita notturna, quartieri locali",
          "Viaggi da solo, in coppia, in famiglia o in gruppo",
          "Viaggio lento o itinerario intenso",
        ],
      },
      {
        id: "confidence",
        eyebrow: "Più sicurezza",
        title: "Arriva con le decisioni giuste già prese.",
        description:
          "Evita gli errori più comuni, risparmia tempo e scegli le esperienze con più sicurezza prima di partire.",
        bullets: [
          "Evita le trappole per turisti",
          "Risparmia tempo nella pianificazione",
          "Sentiti più preparato all'arrivo",
        ],
      },
    ] as CardCopy[],
  },
  en: {
    eyebrow: "For Travelers",
    title: "Find a WayMaker who actually knows the place.",
    subtitle:
      "We carefully select a WayMaker who best matches your destination, travel style and expectations.",
    asideEyebrow: "Get early access",
    asideTitle: "Join as a Traveler",
    asideSubtitle: "Be among the first to get matched with a WayMaker for your next trip.",
    cards: [
      {
        id: "stop-searching",
        eyebrow: "Stop searching",
        title: "Stop jumping between endless travel content.",
        description:
          "Cut through Instagram, TikTok, blogs and random lists. Focus on advice that actually fits your trip.",
        bullets: [
          "Less time comparing random tips",
          "Fewer generic recommendations",
          "More clarity before you travel",
        ],
      },
      {
        id: "human-advice",
        eyebrow: "Human advice",
        title: "Get advice from someone who knows the destination.",
        description:
          "A WayMaker knows the place — because they live there, visit often, or work locally.",
        bullets: [
          "Local timing tips",
          "Practical recommendations",
          "Hidden places and smarter routes",
        ],
      },
      {
        id: "your-trip",
        eyebrow: "Your trip",
        title: "Advice that fits your travel style.",
        description:
          "Tell us where you're going and how you like to travel. We match you with a WayMaker who fits.",
        bullets: [
          "Food, culture, nature, nightlife, local areas",
          "Solo, couple, family, or group trips",
          "Slow travel or intense itinerary",
        ],
      },
      {
        id: "confidence",
        eyebrow: "More confidence",
        title: "Arrive with better decisions already made.",
        description:
          "Avoid common mistakes, save time, and choose experiences with more confidence before you land.",
        bullets: [
          "Avoid tourist traps",
          "Save planning time",
          "Feel more prepared before arrival",
        ],
      },
    ] as CardCopy[],
  },
} as const;

const CARD_ICONS = [
  <Search className="h-5 w-5" />,
  <MapPin className="h-5 w-5" />,
  <RouteIcon className="h-5 w-5" />,
  <ShieldCheck className="h-5 w-5" />,
];

function FindAWayMakerPage() {
  const { locale, changeLocale } = useLocale();
  const copy = COPY[locale];
  const cards: FloatingCarouselItem[] = copy.cards.map((card, index) => ({
    ...card,
    icon: CARD_ICONS[index],
  }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale} onLocaleChange={changeLocale} />
      <main className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{copy.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.1] md:text-5xl">{copy.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground">{copy.subtitle}</p>
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent">{copy.asideEyebrow}</p>
            <h2 className="mt-2 font-display text-2xl leading-tight text-ink">
              {copy.asideTitle}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{copy.asideSubtitle}</p>
            <div className="mt-5">
              <EmailCapture id="join" intendedRole="explorer" location="find_a_waymaker_page" />
            </div>
          </aside>
        </div>

        <div className="mt-12 md:mt-16">
          <FloatingCarousel items={cards} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
