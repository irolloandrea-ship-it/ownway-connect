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

type ChatMsg = { from: "anna" | "marco"; text: string };
type ChatScene = { title: string; subtitle: string; messages: ChatMsg[] };

const CHAT_SCENES: ChatScene[] = [
  {
    title: "Before the trip",
    subtitle: "Anna plans smarter",
    messages: [
      { from: "anna", text: "Hi Marco! I'm going to Capri for 3 days next month. I want it to feel authentic — not crowded and touristy. How should I organize it?" },
      { from: "marco", text: "Change your arrival time. Take the 8:40 ferry instead of the 10:00 — you'll arrive before the organized tours. The first part of the day feels completely different." },
      { from: "anna", text: "That's exactly the advice I need. What should I do first?" },
      { from: "marco", text: "Start with Anacapri, not Capri town. Most people do the opposite. Visit Villa San Michele, then the chairlift to Monte Solaro if the weather is clear." },
      { from: "anna", text: "And lunch? I don't want an overpriced tourist trap." },
      { from: "marco", text: "Avoid the Piazzetta for lunch — nice for a coffee, not a meal. Stay around Anacapri and book for 12:15, not 13:30. Saves you a long wait." },
      { from: "anna", text: "Amazing. Thanks a lot!" },
    ],
  },
  {
    title: "During the trip",
    subtitle: "Anna gets help in the moment",
    messages: [
      { from: "anna", text: "Marco, I'm in Capri now. The Piazzetta is packed and the street to Marina Grande is really crowded. What should we do?" },
      { from: "marco", text: "That area gets chaotic at this hour. Don't go back toward Marina Grande — move away from the main flow, into the quieter side streets behind the Piazzetta." },
      { from: "anna", text: "Good to know. We were about to follow everyone down." },
      { from: "marco", text: "Avoid that for now. For a calmer walk, head toward Via Tragara. Much more pleasant, and beautiful views without the crowd." },
      { from: "anna", text: "Perfect. Thank you!" },
    ],
  },
];

function PhoneMockup() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const scene = CHAT_SCENES[sceneIdx];

  useEffect(() => {
    if (visibleCount < scene.messages.length) {
      const t = setTimeout(() => setVisibleCount((c) => c + 1), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSceneIdx((i) => (i + 1) % CHAT_SCENES.length);
      setVisibleCount(1);
    }, 3200);
    return () => clearTimeout(t);
  }, [visibleCount, sceneIdx, scene.messages.length]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visibleCount, sceneIdx]);

  const shown = scene.messages.slice(0, visibleCount);

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

          {/* chat header */}
          <div className="mt-2 border-b border-border/50 px-4 pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={sceneIdx}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-[9px] uppercase tracking-widest text-gold">{scene.title}</p>
                <p className="font-display text-sm leading-tight">{scene.subtitle}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Anna · Marco (WayMaker)</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* chat body */}
          <div
            ref={scrollRef}
            className="absolute inset-x-0 bottom-6 top-[6.5rem] overflow-hidden px-3 py-2"
          >
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((m, idx) => (
                  <motion.div
                    key={`${sceneIdx}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`flex ${m.from === "anna" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 text-[11px] leading-snug shadow-soft ${
                        m.from === "anna"
                          ? "rounded-br-sm bg-gold/90 text-ink"
                          : "rounded-bl-sm bg-card text-foreground"
                      }`}
                    >
                      <p className="mb-0.5 text-[8px] font-semibold uppercase tracking-widest opacity-70">
                        {m.from === "anna" ? "Anna" : "Marco"}
                      </p>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* scene dots */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {CHAT_SCENES.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all ${idx === sceneIdx ? "w-5 bg-gold" : "w-1.5 bg-border"}`}
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
  const [role, setRole] = useState<"explorer" | "waymaker" | null>(intendedRole ?? null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (intendedRole) setRole(intendedRole);
  }, [intendedRole]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!role) return toast.error("Please choose Traveler or WayMaker");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          email,
          role,
          source: typeof window !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: referredBy || null,
        },
      });
      navigate({
        to: "/waitlist/$code",
        params: { code: res.referral_code },
        search: { role, ...(res.already ? { already: true as const } : {}) },
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not sign you up");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={onSubmit} className="w-full space-y-3">
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mr-2">I want to join as</p>
        <div className="inline-flex rounded-full border border-border/70 bg-card p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setRole("explorer")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "explorer" ? "bg-ink text-background" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "explorer"}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("waymaker")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "waymaker" ? "bg-gold text-ink" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "waymaker"}
          >
            WayMaker
          </button>
        </div>
      </div>
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

      <main>
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
            { icon: Compass, n: "01", title: "Plan your trip", body: "Share your destination, rhythm, interests, budget, and travel style." },
            { icon: Sparkles, n: "02", title: "Get matched with a WayMaker", body: "We connect you with a local who knows the destination and understands the kind of experience you want." },
            { icon: MessageCircleHeart, n: "03", title: "Find your OwnWay", body: "Receive practical, personal advice that can change how you experience the trip." },
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

      {/* Traveler / WayMaker */}
      <section className="bg-secondary/40 py-20 md:py-28">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">For Travelers</p>
            <h3 className="mt-3 font-display text-3xl">Planning a trip?</h3>
            <p className="mt-3 text-muted-foreground">
              Join the waitlist if you want advice that fits your way of traveling, not generic recommendations made for everyone.
            </p>
            <Button onClick={() => scrollToHero("explorer")} className="mt-6 self-start rounded-full">
              Join as Traveler <ArrowRight className="ml-1.5 size-4" />
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
      </main>


      <SiteFooter />
    </div>
  );
}
