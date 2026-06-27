import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getTripByToken } from "@/lib/trip.functions";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/trip/confirmation/$token")({
  head: () => ({ meta: [{ title: "Your OwnWay match is being prepared" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { token } = useParams({ from: "/trip/confirmation/$token" });
  const fetchFn = useServerFn(getTripByToken);
  const { data } = useQuery({
    queryKey: ["trip", token],
    queryFn: () => fetchFn({ data: { token } }),
  });
  const t = data?.trip;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Clock className="size-6 text-gold" />
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl">Your OwnWay match is being prepared</h1>
          <p className="mt-4 text-muted-foreground">
            We're reviewing your trip profile and looking for WayMakers who fit the experience you want to live.
          </p>
        </div>

        {t && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border/60 bg-card p-8 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Destination</p>
                <p className="mt-1 font-display text-3xl">{t.destination_city}</p>
                <p className="text-sm text-muted-foreground">{t.trip_duration}</p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs text-gold-foreground">Matching pending</span>
            </div>
            {!!(t.interests?.length) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {t.interests.map((i: string) => (
                  <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs">{i}</span>
                ))}
              </div>
            )}
            <p className="mt-6 text-sm text-muted-foreground">
              OwnWay is currently a concierge MVP. Your match is reviewed manually to make sure it feels relevant and human.
            </p>
          </div>
        )}

        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          <Link to="/trip/$token" params={{ token }}>
            <Button size="lg" className="rounded-full">Go to my Trip Space <ArrowRight className="ml-1.5 size-4" /></Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
