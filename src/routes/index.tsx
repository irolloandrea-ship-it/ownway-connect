import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Sparkles, Users, Compass, MessageCircleHeart, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OwnWay — Travel your way" },
      { name: "description", content: "OwnWay matches you with the person who understands how you want to experience a destination." },
      { property: "og:title", content: "OwnWay — Travel your way" },
      { property: "og:description", content: "Not the most famous local. The right person for your trip." },
    ],
  }),
  component: LandingPage,
});

const interestTags = ["food", "slow travel", "authentic", "low budget", "local events", "hidden places"];

function MatchingVisual() {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-3xl">
      <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explorer</p>
          <p className="mt-3 font-display text-2xl">Sara, 32</p>
          <p className="mt-1 text-sm text-muted-foreground">3 days in Naples, first time</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {interestTags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="hidden flex-col items-center justify-center md:flex">
          <div className="h-px w-16 bg-gold" />
          <Sparkles className="my-2 size-5 text-gold" />
          <div className="h-px w-16 bg-gold" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">WayMaker</p>
          <p className="mt-3 font-display text-2xl">Marco, Napoli</p>
          <p className="mt-1 text-sm text-muted-foreground">Lives in Vomero · IT/EN</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["authentic food", "walkable", "hidden gems", "low budget"].map((t) => (
              <span key={t} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`container-page py-20 md:py-28 ${className}`}>{children}</section>;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <Section className="text-center">
        <div className="mx-auto flex justify-center">
          <Logo size={56} withWordmark={false} />
        </div>
        <h1 className="mx-auto mt-8 max-w-3xl text-5xl leading-tight md:text-7xl">
          Travel your way.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          OwnWay matches you with the local who understands how you want to experience a destination.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/trip/new">
            <Button size="lg" className="rounded-full px-7">Find my WayMaker <ArrowRight className="ml-1.5 size-4" /></Button>
          </Link>
          <Link to="/waymaker/apply">
            <Button size="lg" variant="ghost" className="rounded-full">Become a WayMaker</Button>
          </Link>
        </div>
        <MatchingVisual />
      </Section>

      <Section className="border-t border-border/60">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">The problem</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Travel research is broken.</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>Today, planning a trip means jumping between TikTok, Instagram, YouTube, blogs, Google Maps, Reddit, guides, and articles.</p>
            <p>The information is everywhere, but it is often generic, repetitive, algorithm-driven, and not adapted to your travel style.</p>
            <p className="text-foreground">The same city can feel magical or disappointing depending on how you experience it.</p>
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/40 -mx-5 px-5 rounded-none">
        <div className="container-page grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">The insight</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Sometimes one conversation is worth hours of research.</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>A two-minute conversation with the right person can change an entire trip.</p>
            <p>Not because that person knows every place — but because they understand where you're staying, how much time you have, what you care about, and what kind of traveler you are.</p>
            <p className="text-foreground">OwnWay makes that conversation possible anywhere.</p>
          </div>
        </div>
      </Section>

      <Section>
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">How it works</p>
        <h2 className="mt-3 text-center text-4xl md:text-5xl">Four small steps. One real conversation.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Compass, title: "Tell us your trip", body: "Destination, duration, budget, rhythm, interests, and travel style." },
            { icon: Sparkles, title: "Define your experience", body: "Authentic or comfortable? Slow or intense? Food, culture, nature, events?" },
            { icon: Users, title: "Get matched", body: "We identify WayMakers who fit your specific trip profile." },
            { icon: MessageCircleHeart, title: "Ask better questions", body: "Personal advice from someone who understands the way you want to travel." },
          ].map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Icon className="size-5 text-gold" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
  </Section>


  <Section className="bg-secondary/40 -mx-5 px-5">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Who it's for</p>
          <h2 className="mt-3 text-4xl md:text-5xl">For travelers who want more than a list.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "First-time visitors to a city",
              "Travelers tired of generic recommendations",
              "People planning short city breaks",
              "Solo travelers",
              "Friend groups & couples",
              "Food-focused travelers",
              "Culture-focused travelers",
              "People who want authentic but safe experiences",
              "Anyone planning a trip that actually fits them",
            ].map((t) => (
              <div key={t} className="rounded-xl border border-border/60 bg-card px-5 py-4 text-sm text-foreground/90 shadow-soft">{t}</div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="text-center">
        <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">You don't need more content. You need the right person.</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/trip/new">
            <Button size="lg" className="rounded-full px-7">Find my WayMaker</Button>
          </Link>
          <Link to="/waymaker/apply">
            <Button size="lg" variant="outline" className="rounded-full">Apply as WayMaker</Button>
          </Link>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
