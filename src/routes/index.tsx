import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ArrowRight, Sparkles, Compass, MessageCircleHeart, Check, Copy, Share2 } from "lucide-react";
import { submitEarlyAccess } from "@/lib/early-access.functions";
import { motion, AnimatePresence } from "framer-motion";

type Role = "explorer" | "waymaker" | "curious";

type Search = { role?: Role; ref?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    role: s.role === "explorer" || s.role === "waymaker" || s.role === "curious" ? s.role : undefined,
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
  head: () => ({
    meta: [
      { title: "OwnWay — The right tip can change the whole trip" },
      { name: "description", content: "OwnWay matches travelers with people who know a destination deeply. Join early access." },
      { property: "og:title", content: "OwnWay — Travel your way" },
      { property: "og:description", content: "Not another generic guide. Not another influencer list. A real person who can say: \"If I were you, I'd do this.\"" },
    ],
  }),
  component: LandingPage,
});

/* ---------------- Hero animation ---------------- */

const SCENES = [
  { kind: "noise" as const, label: "Too many tips. Not enough fit." },
  { kind: "question" as const, label: "What kind of experience do you want to live?" },
  { kind: "match" as const, label: "OwnWay connects you with the right WayMaker." },
  { kind: "tip" as const, label: "“Go at 11:45, not 13:00. You’ll avoid the queue.”" },
  { kind: "moment" as const, label: "That’s an OwnWay Moment." },
  { kind: "final" as const, label: "One trip. One person. One tip that makes the difference." },
];

function HeroAnimation() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SCENES.length), 3400);
    return () => clearInterval(t);
  }, []);
  const scene = SCENES[i];

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 via-background to-accent/40 shadow-card md:aspect-square">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          {scene.kind === "noise" && (
            <div className="relative h-full w-full">
              {["TikTok", "Google Maps", "Blogs", "Reddit", "Instagram", "YouTube"].map((b, idx) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08 }}
                  className="absolute rounded-full bg-card px-3 py-1.5 text-xs shadow-soft"
                  style={{
                    top: `${15 + (idx % 3) * 28}%`,
                    left: `${10 + (idx * 17) % 70}%`,
                  }}
                >
                  {b}
                </motion.div>
              ))}
              <div className="absolute inset-x-6 bottom-6 text-sm text-muted-foreground">{scene.label}</div>
            </div>
          )}

          {scene.kind === "question" && (
            <>
              <Sparkles className="size-8 text-gold" />
              <p className="mt-6 max-w-xs font-display text-3xl leading-tight">{scene.label}</p>
            </>
          )}

          {scene.kind === "match" && (
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex-1 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-soft">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Explorer</p>
                <p className="mt-1 font-display text-lg">Sara</p>
                <p className="text-xs text-muted-foreground">3 days · Naples</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-px w-8 bg-gold" />
                <Sparkles className="my-1 size-4 text-gold" />
                <div className="h-px w-8 bg-gold" />
              </div>
              <div className="flex-1 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-soft">
                <p className="text-[10px] uppercase tracking-widest text-gold">WayMaker</p>
                <p className="mt-1 font-display text-lg">Marco</p>
                <p className="text-xs text-muted-foreground">Lives in Vomero</p>
              </div>
            </div>
          )}

          {scene.kind === "tip" && (
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <MessageCircleHeart className="mx-auto size-6 text-gold" />
              <p className="mt-4 font-display text-2xl italic">{scene.label}</p>
            </div>
          )}

          {scene.kind === "moment" && (
            <>
              <div className="rounded-full bg-gold/20 px-4 py-1 text-xs uppercase tracking-widest text-gold">OwnWay Moment</div>
              <p className="mt-4 font-display text-3xl">{scene.label}</p>
            </>
          )}

          {scene.kind === "final" && (
            <p className="font-display text-2xl leading-snug text-foreground">{scene.label}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SCENES.map((_, idx) => (
          <span key={idx} className={`h-1 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : "w-1.5 bg-border"}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Signup form ---------------- */

function SignupForm({
  role,
  setRole,
  referredBy,
  formRef,
}: {
  role: Role;
  setRole: (r: Role) => void;
  referredBy?: string;
  formRef: React.RefObject<HTMLDivElement | null>;
}) {
  const submit = useServerFn(submitEarlyAccess);
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          email,
          role,
          destination: destination || null,
          source: typeof window !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: referredBy || null,
        },
      });
      setDone({ code: res.referral_code });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not sign you up");
    } finally {
      setSubmitting(false);
    }
  };

  const shareUrl = done && typeof window !== "undefined" ? `${window.location.origin}/?ref=${done.code}` : "";

  return (
    <div ref={formRef} id="join" className="rounded-3xl border border-border/60 bg-card p-6 shadow-card md:p-8">
      {done ? (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
            <Check className="size-6 text-gold" />
          </div>
          <h2 className="mt-5 font-display text-3xl">You’re on the OwnWay early access list.</h2>
          <p className="mt-3 text-muted-foreground">
            We’re building OwnWay city by city. You’ll hear from us when your destination opens.
          </p>
          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-left">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Share2 className="size-3.5" /> Your invite link
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Input readOnly value={shareUrl} className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
              >
                <Copy className="mr-1.5 size-3.5" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Share it with anyone you’d travel with — or anyone who knows a place deeply.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label>I am a…</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["explorer", "waymaker", "curious"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full border px-3 py-2 text-sm capitalize transition ${
                    role === r
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-foreground/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {role !== "curious" && (
            <div>
              <Label htmlFor="dest">
                {role === "explorer" ? "Destination you’re dreaming about" : "City you know deeply"}{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="dest"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={role === "explorer" ? "Naples, Lisbon, Tokyo…" : "Where do you live?"}
                className="mt-2"
              />
            </div>
          )}
          <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Saving…" : "Get Early Access"} <ArrowRight className="ml-1.5 size-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Early access only. No spam. We’re building the first OwnWay community city by city.
          </p>
        </form>
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`container-page py-20 md:py-28 ${className}`}>{children}</section>;
}

function LandingPage() {
  const search = useSearch({ from: "/" });
  const [role, setRole] = useState<Role>(search.role ?? "explorer");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.role) {
      setRole(search.role);
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }, [search.role]);

  const scrollToForm = (r: Role) => {
    setRole(r);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="container-page pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={36} withWordmark={false} />
              <p className="text-xs uppercase tracking-[0.25em] text-gold">OwnWay — Travel your way</p>
            </div>
            <h1 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
              The right tip can change the whole trip.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              OwnWay matches travelers with people who know a destination deeply and can give advice that actually fits the way they want to travel.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Not another generic guide. Not another influencer list. A real person who can say: <span className="italic text-foreground">“If I were you, I’d do this.”</span>
            </p>
            <div className="mt-8">
              <SignupForm role={role} setRole={setRole} referredBy={search.ref} formRef={formRef} />
            </div>
          </div>
          <div className="md:pl-4">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section id="how-it-works" className="border-t border-border/60">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">How OwnWay will work</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center text-4xl md:text-5xl">Three steps. One real conversation.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Compass, n: "01", title: "Tell us how you travel", body: "Your destination, rhythm, budget, interests, and the kind of experience you want." },
            { icon: Sparkles, n: "02", title: "Get matched with a WayMaker", body: "We connect you with someone who understands the destination and your way of traveling." },
            { icon: MessageCircleHeart, n: "03", title: "Find your OwnWay Moment", body: "Receive practical, personal advice that can change how you experience the trip." },
          ].map(({ icon: Icon, n, title, body }) => (
            <div key={n} className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Icon className="size-5 text-gold" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Step {n}</p>
              <h3 className="mt-1 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Two role cards */}
      <Section className="bg-secondary/40 -mx-5 px-5">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">For Explorers</p>
            <h3 className="mt-3 font-display text-3xl">Planning a trip?</h3>
            <p className="mt-3 text-muted-foreground">
              Join early access if you want advice that fits your travel style, not generic recommendations made for everyone.
            </p>
            <Button onClick={() => scrollToForm("explorer")} className="mt-6 self-start rounded-full">
              Join as Explorer <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
          <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">For WayMakers</p>
            <h3 className="mt-3 font-display text-3xl">Know a place deeply?</h3>
            <p className="mt-3 text-muted-foreground">
              Apply to become a founding WayMaker if you can give thoughtful, practical tips that help travelers experience a destination better.
            </p>
            <Button
              onClick={() => scrollToForm("waymaker")}
              className="mt-6 self-start rounded-full bg-gold text-ink hover:bg-gold/80"
            >
              Become a WayMaker <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section className="text-center">
        <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">You don’t need more content. You need the right person.</h2>
        <div className="mt-8">
          <Button size="lg" className="rounded-full px-7" onClick={() => scrollToForm(role)}>
            Get Early Access
          </Button>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
