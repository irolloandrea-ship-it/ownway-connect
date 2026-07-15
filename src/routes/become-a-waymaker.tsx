import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Compass, MessageSquare, Store } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EmailCapture } from "@/components/EmailCapture";
import { FloatingCarousel, type FloatingCarouselItem } from "@/components/ui/floating-carousel";

export const Route = createFileRoute("/become-a-waymaker")({
  head: () => ({
    meta: [
      { title: "Become a WayMaker — OwnWay" },
      { name: "description", content: "Share what you know about a destination and help travelers make better, more authentic choices." },
      { property: "og:title", content: "Become a WayMaker — OwnWay" },
      { property: "og:description", content: "Locals and destination experts help travelers experience a place better. Become a WayMaker on OwnWay." },
    ],
  }),
  component: BecomeAWayMakerPage,
});

const CARDS: FloatingCarouselItem[] = [
  {
    id: "you-know",
    eyebrow: "You know a place",
    title: "You know a destination better than most travelers.",
    description:
      "You don't need to be a professional guide. If you know a place well and can give honest advice, you can help travelers.",
    bullets: [
      "Locals and frequent visitors",
      "Deep destination knowledge",
      "You enjoy helping others travel better",
    ],
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: "better-advice",
    eyebrow: "Better advice",
    title: "Help travelers go beyond generic recommendations.",
    description:
      "Help travelers understand what's really worth doing, what to skip, and how to experience the place better.",
    bullets: [
      "Better timing",
      "Authentic places",
      "Honest local context",
    ],
    icon: <Compass className="h-5 w-5" />,
  },
  {
    id: "perspective",
    eyebrow: "Your perspective",
    title: "Your experience can make someone's trip easier.",
    description:
      "Small details change a whole trip — where to stay, when to visit, how to move around, what's worth the time.",
    bullets: [
      "Food and local neighborhoods",
      "Transport and timing tips",
      "Hidden gems and realistic expectations",
    ],
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "local-business",
    eyebrow: "Local business",
    title: "Own a local business? Share your area transparently.",
    description:
      "Hotel, B&B, restaurant, tour or shop owners can join too — the key is transparency about any business connection.",
    bullets: [
      "Hosts and local operators",
      "Transparent local recommendations",
      "Build trust through useful advice",
    ],
    icon: <Store className="h-5 w-5" />,
  },
];

function BecomeAWayMakerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">For WayMakers</p>
            <h1 className="mt-4 text-4xl leading-[1.1] md:text-5xl">
              Become a WayMaker and help travelers experience your place better.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Share what you know about a destination and help travelers make better,
              more authentic choices.
            </p>
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-accent">Get Early Access</p>
            <h2 className="mt-2 font-display text-2xl leading-tight text-ink">
              Join as a WayMaker
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Be one of the first destination experts on OwnWay.
            </p>
            <div className="mt-5">
              <EmailCapture id="join" intendedRole="waymaker" location="become_a_waymaker_page" />
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
