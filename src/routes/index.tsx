import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus, Compass, HeartHandshake, MessagesSquare } from "lucide-react";
import { captureSourceOnce, trackPrelaunchEvent } from "@/lib/prelaunch-analytics";
import { motion, AnimatePresence } from "framer-motion";
import { OwnWayPhoneCarousel } from "@/components/ui/ownway-phone-carousel";
import { ProofCard } from "@/components/ui/proof-card";
import heroImage from "@/assets/hero-florence.jpg.asset.json";
import { JoinEarlyAccess } from "@/components/JoinEarlyAccess";
import { captureReferralCode } from "@/lib/referral-code";

type Search = { ref?: string; role?: "explorer" | "waymaker" };
type Locale = "it" | "en";

const LANGUAGE_STORAGE_KEY = "ownway_language";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
    role: s.role === "explorer" || s.role === "waymaker" ? s.role : undefined,
  }),
  head: () => ({
    meta: [
      { title: "OwnWay — Consigli di viaggio su misura" },
      {
        name: "description",
        content:
          "OwnWay trova la persona locale giusta da cui ricevere consigli adatti al tuo viaggio. Richiedi l’accesso anticipato.",
      },
      { property: "og:title", content: "OwnWay — Consigli di viaggio su misura" },
      {
        property: "og:description",
        content:
          "Trova la persona locale giusta da cui ricevere consigli adatti al tuo viaggio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ownway.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/027331ec-6db0-4c1e-83d4-7e761ebc4868/id-preview-935629ee--c56c8bb1-b9d6-440f-8629-c68678c7b174.lovable.app-1782563128145.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/027331ec-6db0-4c1e-83d4-7e761ebc4868/id-preview-935629ee--c56c8bb1-b9d6-440f-8629-c68678c7b174.lovable.app-1782563128145.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://ownway.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

/* ---------------- How it works ---------------- */

const STEPS = [
  { icon: Compass, title: "Tell us about your trip" },
  { icon: HeartHandshake, title: "We match you with someone who knows the place" },
  { icon: MessagesSquare, title: "Chat, get advice, and travel with confidence" },
];

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "What is OwnWay?",
    a: "OwnWay connects travelers with trusted locals who can give personalized advice for a specific destination, travel style, and type of trip.",
  },
  {
    q: "Who is OwnWay for?",
    a: "OwnWay connects travelers seeking authentic, personalized travel advice with locals and tour operators who are passionate about sharing the best their destination has to offer.",
  },
  {
    q: "Who are WayMakers?",
    a: "WayMakers are locals or destination experts who know a place well and can help travelers discover better areas, avoid tourist traps, and make smarter trip choices.",
  },
  {
    q: "Is OwnWay available now?",
    a: "OwnWay is currently in pre-launch. You can join the waitlist to get early access when the first beta opens.",
  },
];

function FAQSection({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(0);
  const it = locale === "it";
  const faqs = it
    ? [
        { q: "Cos’è OwnWay?", a: "OwnWay mette in contatto i viaggiatori con persone locali fidate, capaci di offrire consigli personalizzati per una destinazione, uno stile di viaggio e un tipo di esperienza specifici." },
        { q: "A chi è rivolto OwnWay?", a: "OwnWay è per chi cerca consigli di viaggio autentici e personalizzati e per persone locali e operatori che desiderano condividere il meglio della propria destinazione." },
        { q: "Chi sono i WayMaker?", a: "I WayMaker sono persone locali o esperte di una destinazione che aiutano i viaggiatori a scoprire zone migliori, evitare le trappole per turisti e fare scelte più consapevoli." },
        { q: "OwnWay è già disponibile?", a: "OwnWay è attualmente in fase di pre-lancio. Puoi iscriverti alla lista d’attesa per ottenere l’accesso anticipato all’apertura della prima versione beta." },
      ]
    : FAQS;
  return (
    <section className="container-page border-t border-border/60 py-20 md:py-28">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">FAQ</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl md:text-5xl">
        {it ? "Le risposte alle tue domande." : "Questions, answered."}
      </h2>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card shadow-card">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-sand/40 md:px-8"
                aria-expanded={isOpen}
              >
                <span className="font-display text-lg text-ink md:text-xl">{item.q}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-muted-foreground md:px-8">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

function LandingPage() {
  const search = useSearch({ from: "/" });
  const heroFormRef = useRef<HTMLDivElement>(null);
  const [intendedRole, setIntendedRole] = useState<"explorer" | "waymaker" | undefined>(search.role);
  const [joinOpen, setJoinOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("it");
  const it = locale === "it";

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "it" || stored === "en") setLocale(stored);
    } catch {
      // Italian remains the privacy-safe default when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // The switch still works for the current visit.
    }
  };

  useEffect(() => {
    captureReferralCode();
    captureSourceOnce();
    void trackPrelaunchEvent("page_view");
  }, []);

  useEffect(() => {
    if (search.role) {
      setIntendedRole(search.role);
    }
  }, [search.role]);

  // Open the signup dialog for #join deep links (header CTA, /trip/new, /waymaker/apply)
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#join") {
        heroFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setJoinOpen(true);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader locale={locale} onLocaleChange={changeLocale} />

      <main>
        {/* Hero */}
        <section className="container-page pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-10">
            {/* Copy */}
            <div ref={heroFormRef} id="join" className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.26em] text-accent md:text-xs">
                 {it ? "Per viaggiatori curiosi e persone locali" : "For curious travellers & locals"}
              </p>
              <h1 className="mt-4 text-[2.15rem] leading-[1.08] md:text-5xl lg:text-[3.4rem]">
                {it
                  ? "Internet ti dà migliaia di consigli. OwnWay ti aiuta a trovare quello giusto per te."
                  : "Plan smarter and travel deeper with someone who knows the place."}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {it
                  ? "Per i viaggiatori che non vogliono affidarsi a liste e recensioni generiche, OwnWay trova la persona locale giusta da cui ricevere consigli adatti al proprio viaggio."
                  : "For travellers who don’t want to rely on generic lists and reviews, OwnWay finds the right local person to give advice tailored to their trip."}
              </p>

              <div className="mt-8 flex flex-col items-start">
                <JoinEarlyAccess
                  referredBy={search.ref}
                  intendedRole={intendedRole}
                  location="hero_section"
                  open={joinOpen}
                  onOpenChange={(next) => {
                    setJoinOpen(next);
                    if (!next && window.location.hash === "#join") {
                      window.history.replaceState(
                        null,
                        "",
                        window.location.pathname + window.location.search,
                      );
                    }
                  }}
                  locale={locale}
                >
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-full px-8 text-base sm:w-auto"
                    onClick={() =>
                      trackPrelaunchEvent("cta_click", {
                        button_text: "Join early access",
                        button_location: "hero",
                      })
                    }
                  >
                     {it ? "Richiedi l’accesso" : "Join early access"} <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </JoinEarlyAccess>

                <p className="mt-3 text-sm text-muted-foreground">{it ? "Una città alla volta." : "Starting city by city."}</p>
              </div>
            </div>

            {/* Visual composition: photo + the real app preview overlapping it on desktop */}
            <div className="relative lg:min-h-[720px]">
              <img
                src={heroImage.url}
                alt="A local and a traveller talking on a sunlit street in Florence, with the Duomo behind them"
                width={1280}
                height={1600}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/3] w-full rounded-3xl object-cover object-[70%_center] shadow-card sm:aspect-[3/2] lg:absolute lg:inset-y-16 lg:left-0 lg:aspect-auto lg:h-[calc(100%-8rem)] lg:w-[62%] lg:object-[95%_center]"
              />

              <div className="mt-10 flex justify-center lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:origin-top-right lg:scale-[0.9]">
                 <OwnWayPhoneCarousel locale={locale} />
              </div>
            </div>

          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border/60 py-16 md:py-24">
          <div className="container-page">
            <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">
               {it ? "Come funziona" : "How it works"}
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl md:text-4xl">
               {it ? "Un modo più personale di viaggiare." : "A more personal way to travel."}
            </h2>

            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <step.icon className="size-6 text-accent" strokeWidth={1.4} aria-hidden />
                    <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                       {it ? "Passaggio" : "Step"} {i + 1}
                    </span>
                  </div>
                   <p className="mt-4 font-display text-xl leading-snug text-ink">
                     {it
                       ? ["Raccontaci del tuo viaggio", "Ti abbiniamo a qualcuno che conosce davvero il luogo", "Ricevi consigli e viaggia con più sicurezza"][i]
                       : step.title}
                   </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Proof card */}
        <section className="py-4 md:py-8">
          <div className="container-page">
             <ProofCard locale={locale} />
          </div>
        </section>

        {/* Traveler / WayMaker */}
        <section className="mt-16 bg-secondary/50 py-20 md:mt-24 md:py-28">
          <div className="container-page grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-card">
               <p className="text-xs uppercase tracking-[0.25em] text-accent">{it ? "Per viaggiatori" : "For Travelers"}</p>
               <h3 className="mt-3 font-display text-3xl">{it ? "Stai organizzando un viaggio?" : "Planning a trip?"}</h3>
              <p className="mt-3 text-muted-foreground">
                 {it ? "Iscriviti alla lista d’attesa se cerchi consigli adatti al tuo modo di viaggiare, non raccomandazioni generiche pensate per tutti." : "Join the waitlist if you want advice that fits your way of traveling, not generic recommendations made for everyone."}
              </p>
              <Button className="mt-6 self-start rounded-full" asChild>
                <Link to="/find-a-waymaker">
                   {it ? "Partecipa come viaggiatore" : "Join as Traveler"} <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-card">
               <p className="text-xs uppercase tracking-[0.25em] text-accent">{it ? "Per WayMaker" : "For WayMakers"}</p>
               <h3 className="mt-3 font-display text-3xl">{it ? "Conosci bene un luogo?" : "Know a place deeply?"}</h3>
              <p className="mt-3 text-muted-foreground">
                 {it ? "Iscriviti alla lista d’attesa per diventare uno dei primi WayMaker e aiutare i viaggiatori a vivere meglio i luoghi che visitano." : "Join the waitlist if you want to become one of the first WayMakers and help travelers experience places better."}
              </p>
              <Button
                className="mt-6 self-start rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link to="/become-a-waymaker">
                   {it ? "Diventa WayMaker" : "Become a WayMaker"} <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
         <FAQSection locale={locale} />
      </main>

       <SiteFooter locale={locale} />
    </div>
  );
}
