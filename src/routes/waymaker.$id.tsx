import { createFileRoute, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getWaymakerProfile } from "@/lib/waymaker.functions";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/waymaker/$id")({
  head: () => ({ meta: [{ title: "Meet your WayMaker — OwnWay" }] }),
  component: WaymakerPage,
});

function WaymakerPage() {
  const { id } = useParams({ from: "/waymaker/$id" });
  const fn = useServerFn(getWaymakerProfile);
  const { data, isLoading } = useQuery({ queryKey: ["waymaker", id], queryFn: () => fn({ data: { id } }) });

  if (isLoading || !data) return <div className="min-h-screen bg-background"><SiteHeader /><div className="container-page py-20 text-center text-muted-foreground">Loading…</div></div>;
  const p = data.profile;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Logo size={48} withWordmark={false} />
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">{p.level}</p>
                  <h1 className="mt-1 font-display text-4xl">{p.public_name}</h1>
                  <p className="text-sm text-muted-foreground">{p.main_location} · {(p.languages ?? []).join(", ")}</p>
                </div>
              </div>
              {Number(p.way_score_average) > 0 && (
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">WayScore</p>
                  <p className="font-display text-3xl">{Number(p.way_score_average).toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">{p.completed_helps_count} helps</p>
                </div>
              )}
            </div>
            {p.bio && <p className="mt-6 text-foreground/90">{p.bio}</p>}
          </div>

          <section className="mt-8">
            <h2 className="text-2xl">Known destinations</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data.destinations.map((d, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card p-4 shadow-soft">
                  <p className="font-display text-xl">{d.city}{d.country ? `, ${d.country}` : ""}</p>
                  <p className="text-sm text-muted-foreground">{d.relationship_to_destination?.replace(/_/g, " ")}</p>
                  {d.confidence_level && <p className="mt-1 text-xs text-gold">Confidence {d.confidence_level}/5</p>}
                </div>
              ))}
              {data.destinations.length === 0 && <p className="text-sm text-muted-foreground">No destinations listed yet.</p>}
            </div>
          </section>

          {!!(p.travel_style_tags?.length) && (
            <section className="mt-8">
              <h2 className="text-2xl">Travel style</h2>
              <div className="mt-3 flex flex-wrap gap-2">{p.travel_style_tags.map((t: string) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-sm">{t}</span>)}</div>
            </section>
          )}

          {!!(p.best_for_tags?.length) && (
            <section className="mt-8">
              <h2 className="text-2xl">Best for</h2>
              <div className="mt-3 flex flex-wrap gap-2">{p.best_for_tags.map((t: string) => <span key={t} className="rounded-full bg-accent px-3 py-1 text-sm text-gold-foreground">{t}</span>)}</div>
            </section>
          )}

          <section className="mt-10 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft">
            <h2 className="text-2xl">Want this WayMaker for your trip?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create a trip profile and our team will manually consider this WayMaker for your match.</p>
            <div className="mt-5"><a href="/trip/new"><Button className="rounded-full">Create my trip profile</Button></a></div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
