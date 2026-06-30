import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { ArrowRight, Compass, Sparkles, MessageCircleHeart } from "lucide-react";
import { submitEarlyAccess } from "@/lib/early-access.functions";
import { motion, AnimatePresence } from "framer-motion";

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
      { property: "og:title", content: "OwnWay — Travel your way" },
      { property: "og:description", content: "Get matched with locals who know a destination deeply. Join the early access waitlist." },
    ],
  }),
  component: LandingPage,
});

/* ---------------- iPhone mockup animation ---------------- */

const PHONE_SCENES = [
  {
    kind: "ask",
    title: "Anna is planning Capri",
    body: "3 days. Wants calm mornings, slow food, no tourist traps.",
  },
  {
    kind: "match",
    title: "Matched with Marco",
    body: "Lives in Napoli. Goes to Capri every other weekend.",
  },
  {
    kind: "tip",
    title: "Marco’s tip",
    body: "“Skip the 9am ferry — full of tour groups. Take the 11:15 from Mergellina. Lunch at Da Gelsomina, ask for the rabbit.”",
  },
  {
    kind: "moment",
    title: "OwnWay Moment",
    body: "One trip. One local. One tip that makes the difference.",
  },
] as const;

function PhoneMockup() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % PHONE_SCENES.length), 3600);
    return () => clearInterval(t);
  }, []);
  const s = PHONE_SCENES[i];

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="relative rounded-[2.6rem] border-[10px] border-ink/90 bg-ink/90 shadow-card">
        <div className="absolute left-1/2 top-1.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink/90" />
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-gradient-to-b from-secondary/80 via-background to-accent/40">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>OwnWay</span>
            <span>9:41</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-x-0 top-12 bottom-10 flex flex-col items-center px-5 text-center"
            >
              {s.kind === "ask" && (
                <>
                  <div className="rounded-full bg-gold/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                    Explorer
                  </div>
                  <p className="mt-4 font-display text-xl leading-tight">{s.title}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{s.body}</p>
                  <div className="mt-5 w-full rounded-2xl border border-border/60 bg-card p-3 text-left text-xs shadow-soft">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Experience</p>
                    <p className="mt-1">Calm · Local food · Slow rhythm</p>
                  </div>
                </>
              )}
              {s.kind === "match" && (
                <>
                  <div className="mt-2 flex w-full items-center justify-between gap-2">
                    <div className="flex-1 rounded-xl border border-border/60 bg-card p-2.5 text-left shadow-soft">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Explorer</p>
                      <p className="mt-0.5 font-display text-sm">Anna</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sparkles className="size-4 text-gold" />
                    </div>
                    <div className="flex-1 rounded-xl border border-border/60 bg-card p-2.5 text-left shadow-soft">
                      <p className="text-[9px] uppercase tracking-widest text-gold">WayMaker</p>
                      <p className="mt-0.5 font-display text-sm">Marco</p>
                    </div>
                  </div>
                  <p className="mt-5 font-display text-lg leading-tight">{s.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{s.body}</p>
                </>
              )}
              {s.kind === "tip" && (
                <div className="mt-2 w-full rounded-2xl border border-border/60 bg-card p-4 text-left shadow-card">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-gold/20 text-[10px] font-semibold text-gold">M</div>
                    <p className="font-display text-sm">Marco</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-snug italic">{s.body}</p>
                </div>
              )}
              {s.kind === "moment" && (
                <>
                  <div className="rounded-full bg-gold/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                    OwnWay Moment
                  </div>
                  <p className="mt-5 font-display text-xl leading-tight">{s.body}</p>
                  <MessageCircleHeart className="mt-5 size-7 text-gold" />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {PHONE_SCENES.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-5 bg-gold" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Email-only form ---------------- */

function EmailCapture({
  referredBy,
  intendedRole,
  id,
  cta = "Get Early Access",
}: {
  referredBy?: string;
  intendedRole?: "explorer" | "waymaker";
  id?: string;
  cta?: string;
}) {
  const submit = useServerFn(submitEarlyAccess);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          email,
          source: typeof window !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: referredBy || null,
        },
      });
      navigate({
        to: "/waitlist/$code",
        params: { code: res.referral_code },
        search: intendedRole ? { role: intendedRole } : {},
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not sign you up");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="h-12 flex-1 rounded-full px-5 text-base"
        />
        <Button type="submit" size="lg" className="h-12 rounded-full px-6" disabled={submitting}>
          {submitting ? "Saving…" : cta} <ArrowRight className="ml-1.5 size-4" />
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Early access is opening city by city. No spam.
      </p>
    </form>
  );
}

/* ---------------- Page ---------------- */

function LandingPage() {
  const search = useSearch({ from: "/" });
  const heroFormRef = useRef<HTMLDivElement>(null);
  const [intendedRole, setIntendedRole] = useState<"explorer" | "waymaker" | undefined>(search.role);

  useEffect(() => {
    if (search.role) {
      setIntendedRole(search.role);
      setTimeout(() => heroFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }, [search.role]);

  const scrollToHero = (role: "explorer" | "waymaker") => {
    setIntendedRole(role);
    heroFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="container-page pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div ref={heroFormRef}>
            <div className="flex items-center gap-3">
              <Logo size={36} withWordmark={false} />
              <p className="text-xs uppercase tracking-[0.25em] text-gold">OwnWay</p>
            </div>
            <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
              One right tip can change the whole trip.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Get matched with people who know a destination deeply and can help you experience it your way.
            </p>
            <div className="mt-8">
              <EmailCapture referredBy={search.ref} intendedRole={intendedRole} id="join" />
            </div>
          </div>
          <div className="md:pl-4">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container-page border-t border-border/60 py-20 md:py-28">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">How OwnWay works</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl md:text-5xl">
          Travel planning is full of content. We help you find the person.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Compass, n: "01", title: "Tell us how you travel", body: "When early access opens, you’ll share your destination, rhythm, interests, budget, and travel style." },
            { icon: Sparkles, n: "02", title: "Get matched with a WayMaker", body: "We connect you with a local who knows the destination and understands the kind of experience you want." },
            { icon: MessageCircleHeart, n: "03", title: "Find your OwnWay Moment", body: "Receive practical, personal advice that can change how you experience the trip." },
          ].map(({ icon: Icon, n, title, body }) => (
            <motion.div
              key={n}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="rounded-2xl border border-border/60 bg-card p-7 shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
                <Icon className="size-5 text-gold" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Step {n}</p>
              <h3 className="mt-1 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explorer / WayMaker */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">For Explorers</p>
            <h3 className="mt-3 font-display text-3xl">Planning a trip?</h3>
            <p className="mt-3 text-muted-foreground">
              Join the waitlist if you want advice that fits your way of traveling, not generic recommendations made for everyone.
            </p>
            <Button onClick={() => scrollToHero("explorer")} className="mt-6 self-start rounded-full">
              Join as Explorer <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
          <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">For WayMakers</p>
            <h3 className="mt-3 font-display text-3xl">Know a place deeply?</h3>
            <p className="mt-3 text-muted-foreground">
              Join the waitlist if you want to become one of the first WayMakers and help travelers experience places better.
            </p>
            <Button
              onClick={() => scrollToHero("waymaker")}
              className="mt-6 self-start rounded-full bg-gold text-ink hover:bg-gold/80"
            >
              Become a WayMaker <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">Be first to find your OwnWay.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Early access is opening soon. Join the waitlist and move up by inviting friends.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <EmailCapture referredBy={search.ref} intendedRole={intendedRole} />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
