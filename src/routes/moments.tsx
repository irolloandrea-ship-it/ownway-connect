import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Star } from "lucide-react";

export const Route = createFileRoute("/moments")({
  head: () => ({
    meta: [
      { title: "OwnWay Moments — The advice that changes the trip" },
      { name: "description", content: "OwnWay Moments reward the advice that concretely improved a traveler's trip — not popularity, not follower count." },
      { property: "og:title", content: "OwnWay Moments — The advice that changes the trip" },
      { property: "og:description", content: "We reward impact, not popularity. One trip. One OwnWay Moment. One piece of advice that made the difference." },
    ],
  }),
  component: MomentsPage,
});

function MomentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container-page py-20 md:py-28">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">OwnWay Moments</p>
        <h1 className="mt-3 text-center text-4xl md:text-6xl">The advice that changes the trip.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          An OwnWay Moment is the one piece of advice that made your trip better, smoother, richer, or more memorable.
        </p>
        <div className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
          <p>Most travel platforms show ratings, likes, followers, and generic reviews. OwnWay is different.</p>
          <p className="mt-2">
            We care about the moment when a traveler says: <span className="italic text-foreground">“That advice changed my trip.”</span>
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-16 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl">OwnWay Moments turn advice into stories.</h2>
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
      </section>
      <SiteFooter />
    </div>
  );
}
