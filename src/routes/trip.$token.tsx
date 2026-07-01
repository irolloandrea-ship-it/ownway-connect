import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getTripByToken, selectWaymaker } from "@/lib/trip.functions";

export const Route = createFileRoute("/trip/$token")({
  head: ({ params }) => ({
    meta: [
      { title: "My OwnWay Trip Space" },
      { name: "description", content: "Your private OwnWay trip space — review your match and coordinate with your WayMaker." },
      { property: "og:title", content: "My OwnWay Trip Space" },
      { property: "og:description", content: "Your private OwnWay trip space — review your match and coordinate with your WayMaker." },
      { property: "og:url", content: `https://ownway-connect.lovable.app/trip/${params.token}` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TripSpace,
});

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  matching_pending: "Matching pending",
  matched: "Matched",
  contacted: "Contacted",
  completed: "Completed",
  feedback_pending: "Feedback pending",
};

function TripSpace() {
  const { token } = useParams({ from: "/trip/$token" });
  const fetchFn = useServerFn(getTripByToken);
  const select = useServerFn(selectWaymaker);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["trip", token],
    queryFn: () => fetchFn({ data: { token } }),
  });
  const m = useMutation({
    mutationFn: (matchId: string) => select({ data: { token, matchId } }),
    onSuccess: () => { toast.success("We'll help you connect with this WayMaker."); qc.invalidateQueries({ queryKey: ["trip", token] }); },
    onError: (e: any) => toast.error(e?.message ?? "Could not save"),
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background"><SiteHeader /><div className="container-page py-20 text-center text-muted-foreground">Loading…</div></div>
    );
  }

  const t = data.trip;
  const matches = data.matches;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold">My Trip Space</p>
              <h1 className="mt-2 text-4xl md:text-5xl">{t.destination_city}</h1>
              <p className="text-muted-foreground">{t.trip_duration}{t.travel_group ? ` · ${t.travel_group}` : ""}</p>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs">{STATUS_LABEL[t.status] ?? t.status}</span>
          </header>

          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="text-2xl">Trip summary</h2>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <Row k="Dates" v={[t.travel_start_date, t.travel_end_date].filter(Boolean).join(" → ") || "Flexible"} />
              <Row k="Travel group" v={t.travel_group ?? "—"} />
              <Row k="First time" v={t.first_time_destination ?? "—"} />
              <Row k="Stay" v={t.accommodation_area ?? "—"} />
              <Row k="Budget" v={t.budget_style ?? "—"} />
              <Row k="Languages" v={(t.preferred_languages ?? []).join(", ") || "—"} />
            </dl>
            {!!(t.interests?.length) && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Interests</p>
                <div className="mt-2 flex flex-wrap gap-2">{t.interests.map((i: string) => <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs">{i}</span>)}</div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="text-2xl">Matching status</h2>
            {t.status === "matching_pending" && <p className="mt-2 text-muted-foreground">Your match is being reviewed manually.</p>}
            {(t.status === "matched" || t.status === "contacted") && <p className="mt-2 text-muted-foreground">Your suggested WayMakers are ready.</p>}
            {t.admin_notes && (
              <div className="mt-5 rounded-xl bg-secondary/60 p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Note from OwnWay</p>
                <p className="mt-1">{t.admin_notes}</p>
              </div>
            )}
          </section>

          {matches.length > 0 && (
            <section>
              <h2 className="text-2xl">Suggested WayMakers</h2>
              <div className="mt-4 space-y-4">
                {matches.map((m0: any) => {
                  const p = m0.waymaker_profiles;
                  return (
                    <article key={m0.id} className={`rounded-2xl border p-6 shadow-soft ${m0.explorer_selected ? "border-gold bg-accent/40" : "border-border/60 bg-card"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-gold">{p?.level ?? "WayMaker"}</p>
                          <h3 className="mt-1 text-2xl">{p?.public_name}</h3>
                          <p className="text-sm text-muted-foreground">{p?.main_location} · {(p?.languages ?? []).join(", ")}</p>
                        </div>
                        {m0.explorer_selected && <span className="rounded-full bg-foreground px-3 py-1 text-xs text-background">Selected</span>}
                      </div>
                      {!!(p?.travel_style_tags?.length) && (
                        <div className="mt-3 flex flex-wrap gap-2">{p.travel_style_tags.slice(0, 6).map((t: string) => <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{t}</span>)}</div>
                      )}
                      {m0.admin_match_reason && <p className="mt-4 text-sm italic text-muted-foreground">"{m0.admin_match_reason}"</p>}
                      <div className="mt-5 flex gap-2">
                        <Link to="/waymaker/$id" params={{ id: p?.id }}>
                          <Button variant="outline" size="sm" className="rounded-full">View profile</Button>
                        </Link>
                        {!m0.explorer_selected && (
                          <Button size="sm" className="rounded-full" disabled={m.isPending} onClick={() => m.mutate(m0.id)}>
                            I'm interested in this WayMaker
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {(t.status === "contacted" || t.status === "completed" || t.status === "feedback_pending") && (
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
              <h2 className="text-2xl">Feedback</h2>
              <p className="mt-2 text-sm text-muted-foreground">Tell us how it went — your input helps OwnWay grow.</p>
              <div className="mt-4">
                <Link to="/trip/$token/feedback" params={{ token }}>
                  <Button className="rounded-full">Give feedback</Button>
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
