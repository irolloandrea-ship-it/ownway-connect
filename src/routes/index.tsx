import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { HowItWorksFlipCards } from "@/components/HowItWorksFlipCards";
import { captureSourceOnce, trackPrelaunchEvent } from "@/lib/prelaunch-analytics";
import { motion, AnimatePresence } from "framer-motion";
import { OwnWayPhoneCarousel } from "@/components/ui/ownway-phone-carousel";
import screen9 from "@/assets/screen-9.png.asset.json";
import screen10 from "@/assets/screen-10.png.asset.json";
import screen11 from "@/assets/screen-11.png.asset.json";
import screen12 from "@/assets/screen-12.png.asset.json";
import screen13 from "@/assets/screen-13.png.asset.json";
import screen14 from "@/assets/screen-14.png.asset.json";
import screen15 from "@/assets/screen-15.png.asset.json";
import { EmailCapture } from "@/components/EmailCapture";

const APP_SCREENS = [
  { src: screen13.url, alt: "OwnWay — Discover curated journeys" },
  { src: screen10.url, alt: "OwnWay — Choose your destination" },
  { src: screen9.url, alt: "OwnWay — Pick your travel dates" },
  { src: screen11.url, alt: "OwnWay — Select your travel style" },
  { src: screen12.url, alt: "OwnWay — Finding WayMakers for your trip" },
  { src: screen15.url, alt: "OwnWay — Suggested WayMakers for Florence" },
  { src: screen14.url, alt: "OwnWay — My Journeys dashboard" },
];

type Search = { ref?: string; role?: "explorer" | "waymaker" };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
    role: s.role === "explorer" || s.role === "waymaker" ? s.role : undefined,
  }),
  head: () => ({
    meta: [
      { title: "OwnWay — One right tip can change the whole trip" },
      { name: "description", content: "Join the OwnWay waitlist. Get matched with locals who know a destination deeply and can help you experience it your way." },
      { property: "og:title", content: "OwnWay — One right tip can change the whole trip" },
      { property: "og:description", content: "Join the OwnWay waitlist. Get matched with locals who know a destination deeply and can help you experience it your way." },
      { property: "og:url", content: "https://ownway.app/" },
    ],
  }),
  component: LandingPage,
});

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

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page border-t border-border/60 py-20 md:py-28">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">FAQ</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl md:text-5xl">
        Questions, answered.
      </h2>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card shadow-card">
        {FAQS.map((item, i) => {
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
                    transition={{ duration: 0.25, ease: "easeOut" }}
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

  useEffect(() => {
    captureSourceOnce();
    void trackPrelaunchEvent("page_view");
  }, []);

  useEffect(() => {
    if (search.role) {
      setIntendedRole(search.role);
      setTimeout(() => heroFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }, [search.role]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="container-page pt-12 pb-20 md:pt-20 md:pb-28">
          <div ref={heroFormRef} className="mx-auto max-w-xl text-center md:max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-accent md:text-xs">
              Travel deeper. Share what you know
            </p>
            <h1 className="mt-5 text-[2rem] leading-[1.12] md:text-5xl">
              One right tip can change the whole trip
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              OwnWay connects travellers who want to experience a destination more deeply
              with local experts ready to share what they know.
            </p>
            <div className="mt-8 flex flex-col items-center">
              <JoinEarlyAccess referredBy={search.ref} intendedRole={intendedRole} location="hero_section">
                <Button size="lg" className="h-12 w-full rounded-full px-8 text-base sm:w-auto">
                  Join early access <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </JoinEarlyAccess>
              <p className="mt-3 text-sm text-muted-foreground">
                Early access for travellers and local experts.
              </p>
            </div>
          </div>
        </section>

        {/* How OwnWay works */}
        <section className="border-t border-border/60 py-20 md:py-28">
          <div className="container-page">
            <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">
              How OwnWay works
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl md:text-5xl">
              A more personal way to travel.
            </h2>

            <div className="mt-14 grid items-center gap-14 md:grid-cols-2 md:gap-16">
              <div className="order-2 space-y-6 md:order-1">
                {[
                  "Tell us what matters to you",
                  "Meet someone who knows the destination",
                  "Travel with a plan that feels yours",
                ].map((step, i) => (
                  <div
                    key={step}
                    className="flex items-start gap-4 rounded-3xl bg-card/70 px-6 py-6"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm text-accent">
                      {i + 1}
                    </span>
                    <p className="font-display text-xl leading-snug text-ink md:text-2xl">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="order-1 md:order-2 md:pl-4">
                <OwnWayPhoneCarousel />
              </div>
            </div>
          </div>
        </section>



        {/* Traveler / WayMaker */}
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container-page grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">For Travelers</p>
              <h3 className="mt-3 font-display text-3xl">Planning a trip?</h3>
              <p className="mt-3 text-muted-foreground">
                Join the waitlist if you want advice that fits your way of traveling, not generic recommendations made for everyone.
              </p>
              <Button className="mt-6 self-start rounded-full" asChild>
                <Link to="/find-a-waymaker">
                  Join as Traveler <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">For WayMakers</p>
              <h3 className="mt-3 font-display text-3xl">Know a place deeply?</h3>
              <p className="mt-3 text-muted-foreground">
                Join the waitlist if you want to become one of the first WayMakers and help travelers experience places better.
              </p>
              <Button
                className="mt-6 self-start rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link to="/become-a-waymaker">
                  Become a WayMaker <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}
