import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Compass, Sparkles, MessageCircleHeart, Plus, Minus } from "lucide-react";
import { captureSourceOnce, trackPrelaunchEvent } from "@/lib/prelaunch-analytics";
import { motion, AnimatePresence } from "framer-motion";
import { JourneyMockup } from "@/components/JourneyMockup";
import { EmailCapture } from "@/components/EmailCapture";

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
      { property: "og:description", content: "Get matched with a local WayMaker who knows your destination deeply. Join the OwnWay early-access waitlist." },
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

  const scrollToHero = (role: "explorer" | "waymaker") => {
    trackPrelaunchEvent("cta_click", {
      button_text: role === "explorer" ? "Join as Traveler" : "Become a WayMaker",
      button_location: "role_section",
    });
    setIntendedRole(role);
    heroFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="container-page pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div ref={heroFormRef}>
              <Logo size={36} withWordmark />

              <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
                One right tip can change the whole trip.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Get matched with people who know a destination deeply and can help you experience it your way.
              </p>
              <div className="mt-8">
                <EmailCapture referredBy={search.ref} intendedRole={intendedRole} id="join" location="hero_section" />
              </div>
            </div>
            <div className="md:pl-4">
              <JourneyMockup />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="container-page border-t border-border/60 py-20 md:py-28">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-accent">How OwnWay works</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-4xl md:text-5xl">
            AI can give you answers. OwnWay connects you with people who have lived them.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Compass, n: "01", title: "Plan your trip", body: "Share your destination, rhythm, interests, budget, and travel style." },
              { icon: Sparkles, n: "02", title: "Get matched with a WayMaker", body: "We connect you with a local who knows the destination and understands the kind of experience you want." },
              { icon: MessageCircleHeart, n: "03", title: "Find your OwnWay", body: "Once your WayMaker accepts, contact details unlock and you continue the conversation outside OwnWay." },
            ].map(({ icon: Icon, n, title, body }) => (
              <motion.div
                key={n}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="rounded-2xl border border-border/60 bg-card p-7 shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
                  <Icon className="size-5 text-accent" />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Step {n}</p>
                <h3 className="mt-1 text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </motion.div>
            ))}
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
              <Button onClick={() => scrollToHero("explorer")} className="mt-6 self-start rounded-full">
                Join as Traveler <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
            <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">For WayMakers</p>
              <h3 className="mt-3 font-display text-3xl">Know a place deeply?</h3>
              <p className="mt-3 text-muted-foreground">
                Join the waitlist if you want to become one of the first WayMakers and help travelers experience places better.
              </p>
              <Button
                onClick={() => scrollToHero("waymaker")}
                className="mt-6 self-start rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Become a WayMaker <ArrowRight className="ml-1.5 size-4" />
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
