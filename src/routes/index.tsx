import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowRight, Sparkles, Users, Compass, MessageCircleHeart } from "lucide-react";

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
            <h2 className="mt-4 text-4xl md:text-5xl">Planning a trip has become overwhelming.</h2>
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

  <Section className="bg-secondary/40 -mx-5 px-5 border-t border-border/60">
    <div className="container-page">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">OwnWay Moments</p>
      <h2 className="mt-3 text-center text-4xl md:text-5xl">The advice that changes the trip.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        An OwnWay Moment is the one piece of advice that made your trip better, smoother, richer, or more memorable.
      </p>
      <div className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
        <p>
          Most travel platforms show ratings, likes, followers, and generic reviews. OwnWay is different.
        </p>
        <p className="mt-2">
          We care about the moment when a traveler says: <span className="italic text-foreground">“That advice changed my trip.”</span>
        </p>
      </div>
      <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Examples, not real testimonials
      </p>
      <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Beat the crowd", tip: "Take the 8:40 ferry instead of the 10:00 one. You’ll arrive before the organized tours.", reaction: "This helped us experience Capri before the crowds arrived. It completely changed the day." },
          { title: "Better timing", tip: "Go at sunset, not in the morning. The light, atmosphere, and crowd level are completely different.", reaction: "It turned a normal visit into the most memorable moment of the trip." },
          { title: "Avoid the trap", tip: "Skip the restaurant on the main square. Walk 300 meters and you’ll find a similar place without the queue.", reaction: "We saved time, money, and had a much better meal." },
          { title: "Local context", tip: "There’s a transport strike today. Don’t plan the city across metro lines.", reaction: "This saved our day from becoming stressful and chaotic." },
        ].map((m) => (
          <div key={m.title} className="flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.15em] text-gold">OwnWay Moment</span>
            </div>
            <h3 className="mt-4 text-xl">{m.title}</h3>
            <p className="mt-2 text-sm italic text-foreground">“{m.tip}”</p>
            <p className="mt-auto border-t border-border/40 pt-4 text-sm text-muted-foreground">{m.reaction}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-16 items-center">
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl">OwnWay Moments turn advice into stories.</h3>
          <p className="text-muted-foreground">
            They help Explorers understand who they can trust and help WayMakers show the real impact of their knowledge.
          </p>
          <blockquote className="border-l-2 border-gold pl-4 italic text-foreground">
            “OwnWay does not reward the loudest traveler, the biggest influencer, or the most active user. It rewards the advice that actually changed someone’s trip.”
          </blockquote>
          <p className="text-sm font-medium text-gold">
            One trip. One OwnWay Moment. One piece of advice that made the difference.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-lg">M</div>
            <div>
              <p className="font-display text-xl">Marco</p>
              <p className="text-xs text-muted-foreground">Napoli · WayMaker</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="font-display text-xl">248</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">travelers guided</p>
            </div>
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="font-display text-xl">97%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Match Accuracy</p>
            </div>
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="font-display text-xl">96%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Advice Accuracy</p>
            </div>
            <div className="rounded-xl bg-secondary/60 p-3 text-center">
              <p className="font-display text-xl">31</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">OwnWay Moments</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-accent/40 px-4 py-3 text-center">
            <p className="text-sm text-accent-foreground">31 people found their OwnWay thanks to Marco.</p>
          </div>
          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-border/40 bg-background/50 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider text-gold">OwnWay Moment</p>
              <p className="text-sm italic text-foreground">“Don’t stop only in Bellagio. Go to Varenna after 18:00.”</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/50 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider text-gold">OwnWay Moment</p>
              <p className="text-sm italic text-foreground">“The Teatro San Carlo visit lasts only 35 minutes. Don’t skip it.”</p>
            </div>
          </div>
        </div>
      </div>
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
