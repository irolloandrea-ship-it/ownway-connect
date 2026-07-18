import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmailCapture } from "@/components/EmailCapture";
import { FloatingCarousel, type FloatingCarouselItem } from "@/components/ui/floating-carousel";

export const Route = createFileRoute("/find-a-waymaker")({
  head: () => ({
    meta: [
      { title: "Find a WayMaker — OwnWay" },
      { name: "description", content: "Find a WayMaker who knows your destination and get practical, human advice for your real trip." },
      { property: "og:title", content: "Find a WayMaker — OwnWay" },
      { property: "og:description", content: "Get personal travel advice from a local WayMaker who knows your destination." },
    ],
  }),
  component: FindAWayMakerPage,
});

const CARDS: FloatingCarouselItem[] = [
  {
    id: "stop-searching",
    eyebrow: "Stop searching",
    title: "Stop jumping between endless travel content.",
    description:
      "Cut through Instagram, TikTok, blogs and random lists. Focus on advice that actually fits your trip.",
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
      "A WayMaker knows the place — because they live there, visit often, or work locally.",
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
      "Tell us where you're going and how you like to travel. We match you with a WayMaker who fits.",
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
      "Avoid common mistakes, save time, and choose experiences with more confidence before you land.",
    bullets: [
      "Avoid tourist traps",
      "Save planning time",
      "Feel more prepared before arrival",
    ],
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

function FindAWayMakerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">For Travelers</p>
            <h1 className="mt-4 text-4xl leading-[1.1] md:text-5xl">
              Find a WayMaker who actually knows the place.
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
              <EmailCapture id="join" intendedRole="explorer" location="find_a_waymaker_page" />
            </div>
          </aside>
        </div>

        <div className="mt-12 md:mt-16">
          <FloatingCarousel items={CARDS} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
