import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmailCapture } from "@/components/EmailCapture";
import { ExpandingCards, type ExpandingCardItem } from "@/components/ui/expanding-cards";

export const Route = createFileRoute("/plan-a-trip")({
  head: () => ({
    meta: [
      { title: "Plan a Trip — OwnWay" },
      { name: "description", content: "Stop searching everywhere. OwnWay helps you get practical, human advice from someone who actually knows your destination." },
      { property: "og:title", content: "Plan a Trip — OwnWay" },
      { property: "og:description", content: "Get personal travel advice from a local WayMaker who knows your destination." },
    ],
  }),
  component: PlanATripPage,
});

const CARDS: ExpandingCardItem[] = [
  {
    id: "stop-searching",
    eyebrow: "Stop searching",
    title: "Stop jumping between endless travel content.",
    description:
      "Planning a trip often means opening Instagram, TikTok, blogs, reviews, maps, and random lists — and still not knowing what actually fits your trip. OwnWay helps you cut through the noise and focus on advice that is relevant to you.",
    bullets: [
      "Less time comparing random tips",
      "Fewer generic recommendations",
      "More clarity before you travel",
    ],
    icon: <Search className="h-5 w-5" />,
  },
  {
    id: "human-advice",
    eyebrow: "Human advice",
    title: "Get advice from someone who knows the destination.",
    description:
      "A WayMaker is someone who knows a place well — because they live there, grew up there, visit often, or work locally. They can help you understand what is worth doing, what to avoid, when to go, and how to make your trip feel more authentic.",
    bullets: [
      "Local timing tips",
      "Practical recommendations",
      "Hidden places and smarter routes",
    ],
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "your-trip",
    eyebrow: "Your trip",
    title: "Advice that fits your travel style.",
    description:
      "OwnWay is not about giving everyone the same itinerary. You tell us where you are going, who you are traveling with, what you care about, and what kind of experience you want. Then we help match you with a WayMaker who fits your trip.",
    bullets: [
      "Food, culture, nature, nightlife, local areas",
      "Solo, couple, family, or group trips",
      "Slow travel or intense itinerary",
    ],
    icon: <RouteIcon className="h-5 w-5" />,
  },
  {
    id: "confidence",
    eyebrow: "More confidence",
    title: "Arrive with better decisions already made.",
    description:
      "Before your trip, you can receive useful advice that helps you avoid common mistakes, save time, and choose experiences with more confidence. The goal is simple: make your trip feel easier, smarter, and more personal.",
    bullets: [
      "Avoid tourist traps",
      "Save planning time",
      "Feel more prepared before arrival",
    ],
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

function PlanATripPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">For Travelers</p>
            <h1 className="mt-4 text-4xl leading-[1.1] md:text-5xl">
              Plan a trip with advice from someone who actually knows the place.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              We carefully select a WayMaker who best matches your destination, travel style and expectations.
            </p>
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent">Get early access</p>
            <h2 className="mt-2 font-display text-2xl leading-tight text-ink">
              Join as a Traveler
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Be among the first to get matched with a WayMaker for your next trip.
            </p>
            <div className="mt-5">
              <EmailCapture id="join" intendedRole="explorer" location="plan_a_trip_page" />
            </div>
          </aside>
        </div>

        <div className="mt-12 md:mt-16">
          <ExpandingCards items={CARDS} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
