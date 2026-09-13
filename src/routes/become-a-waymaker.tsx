import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Compass, MessageSquare, Store } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmailCapture } from "@/components/EmailCapture";
import { FloatingCarousel, type FloatingCarouselItem } from "@/components/ui/floating-carousel";
import { useLocale } from "@/lib/use-locale";

export const Route = createFileRoute("/become-a-waymaker")({
  head: () => ({
    meta: [
      { title: "Diventa WayMaker — OwnWay" },
      { name: "description", content: "Condividi ciò che conosci di una destinazione e aiuta i viaggiatori a fare scelte migliori e più autentiche." },
      { property: "og:title", content: "Diventa WayMaker — OwnWay" },
      { property: "og:description", content: "Persone locali ed esperti di destinazione aiutano i viaggiatori a vivere meglio un luogo. Diventa WayMaker su OwnWay." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.ownway.app/become-a-waymaker" },
      { name: "robots", content: "noindex, follow" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://ownway.app/become-a-waymaker" }],
  }),
  component: BecomeAWayMakerPage,
});

type CardCopy = Omit<FloatingCarouselItem, "icon">;

const COPY = {
  it: {
    eyebrow: "Per i WayMaker",
    title: "Diventa WayMaker e aiuta i viaggiatori a vivere meglio il tuo territorio.",
    subtitle:
      "Condividi ciò che conosci di una destinazione e aiuta i viaggiatori a fare scelte migliori e più autentiche.",
    asideEyebrow: "Accesso anticipato",
    asideTitle: "Iscriviti come WayMaker",
    asideSubtitle: "Sarai tra i primi esperti di destinazione su OwnWay.",
    cards: [
      {
        id: "you-know",
        eyebrow: "Conosci un posto",
        title: "Conosci una destinazione meglio della maggior parte dei viaggiatori.",
        description:
          "Non serve essere una guida professionale. Se conosci bene un posto e sai dare consigli onesti, puoi aiutare i viaggiatori.",
        bullets: [
          "Persone del posto e visitatori abituali",
          "Conoscenza profonda della destinazione",
          "Ti piace aiutare gli altri a viaggiare meglio",
        ],
      },
      {
        id: "better-advice",
        eyebrow: "Consigli migliori",
        title: "Aiuta i viaggiatori ad andare oltre le raccomandazioni generiche.",
        description:
          "Aiuta i viaggiatori a capire cosa vale davvero la pena fare, cosa saltare e come vivere meglio il posto.",
        bullets: [
          "Tempistiche migliori",
          "Luoghi autentici",
          "Contesto locale onesto",
        ],
      },
      {
        id: "perspective",
        eyebrow: "La tua esperienza",
        title: "La tua esperienza può rendere il viaggio di qualcuno più semplice.",
        description:
          "I piccoli dettagli cambiano un intero viaggio — dove dormire, quando visitare, come muoversi, cosa merita il tuo tempo.",
        bullets: [
          "Cibo e quartieri locali",
          "Consigli su trasporti e tempistiche",
          "Gemme nascoste e aspettative realistiche",
        ],
      },
      {
        id: "local-business",
        eyebrow: "Attività locali",
        title: "Hai un'attività locale? Condividi la tua zona con trasparenza.",
        description:
          "Anche hotel, B&B, ristoranti, tour operator e negozi possono unirsi — l'importante è la trasparenza su eventuali legami commerciali.",
        bullets: [
          "Host e operatori locali",
          "Raccomandazioni locali trasparenti",
          "Costruisci fiducia con consigli utili",
        ],
      },
    ] as CardCopy[],
  },
  en: {
    eyebrow: "For WayMakers",
    title: "Become a WayMaker and help travelers experience your place better.",
    subtitle:
      "Share what you know about a destination and help travelers make better, more authentic choices.",
    asideEyebrow: "Get Early Access",
    asideTitle: "Join as a WayMaker",
    asideSubtitle: "Be one of the first destination experts on OwnWay.",
    cards: [
      {
        id: "you-know",
        eyebrow: "You know a place",
        title: "You know a destination better than most travelers.",
        description:
          "You don't need to be a professional guide. If you know a place well and can give honest advice, you can help travelers.",
        bullets: [
          "Locals and frequent visitors",
          "Deep destination knowledge",
          "You enjoy helping others travel better",
        ],
      },
      {
        id: "better-advice",
        eyebrow: "Better advice",
        title: "Help travelers go beyond generic recommendations.",
        description:
          "Help travelers understand what's really worth doing, what to skip, and how to experience the place better.",
        bullets: [
          "Better timing",
          "Authentic places",
          "Honest local context",
        ],
      },
      {
        id: "perspective",
        eyebrow: "Your perspective",
        title: "Your experience can make someone's trip easier.",
        description:
          "Small details change a whole trip — where to stay, when to visit, how to move around, what's worth the time.",
        bullets: [
          "Food and local neighborhoods",
          "Transport and timing tips",
          "Hidden gems and realistic expectations",
        ],
      },
      {
        id: "local-business",
        eyebrow: "Local business",
        title: "Own a local business? Share your area transparently.",
        description:
          "Hotel, B&B, restaurant, tour or shop owners can join too — the key is transparency about any business connection.",
        bullets: [
          "Hosts and local operators",
          "Transparent local recommendations",
          "Build trust through useful advice",
        ],
      },
    ] as CardCopy[],
  },
} as const;

const CARD_ICONS = [
  <MapPin className="h-5 w-5" />,
  <Compass className="h-5 w-5" />,
  <MessageSquare className="h-5 w-5" />,
  <Store className="h-5 w-5" />,
];

function BecomeAWayMakerPage() {
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
              <EmailCapture id="join" intendedRole="waymaker" location="become_a_waymaker_page" />
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
