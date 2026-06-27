import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFeed, getFeedCities } from "@/lib/feed.functions";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "City Feed — OwnWay" },
      { name: "description", content: "Temporary local updates from the OwnWay community." },
    ],
  }),
  component: FeedPage,
});

const CATEGORIES = ["Events", "Food", "Culture", "Nightlife", "Transport", "Warnings", "Seasonal", "Sport", "Other"];

function FeedPage() {
  const citiesFn = useServerFn(getFeedCities);
  const feedFn = useServerFn(getFeed);
  const [city, setCity] = useState<string>("");
  const [cat, setCat] = useState<string>("");
  const { data: cities = [] } = useQuery({ queryKey: ["feed-cities"], queryFn: () => citiesFn() });
  const { data: posts = [] } = useQuery({
    queryKey: ["feed", city, cat],
    queryFn: () => feedFn({ data: { city: city || null, category: cat || null } }),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-12">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">City Feed</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Temporary updates from the OwnWay community.</h1>
          <p className="mt-3 text-sm text-muted-foreground">Events, food, transport notes and seasonal tips — light, moderated, useful.</p>
        </header>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v)}>
            <SelectTrigger className="w-48 rounded-full"><SelectValue placeholder="All cities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCat("")} className={`rounded-full border px-3 py-1.5 text-sm ${!cat ? "border-foreground bg-foreground text-background" : "border-border bg-card"}`}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1.5 text-sm ${cat === c ? "border-foreground bg-foreground text-background" : "border-border bg-card"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {posts.length === 0 && (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
              No posts yet for this filter. The feed is intentionally light — the heart of OwnWay is the matching.
            </div>
          )}
          {posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>{p.city}</span>
                <span className="text-gold">{p.category}</span>
              </div>
              <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
              {p.description && <p className="mt-2 text-sm text-foreground/90">{p.description}</p>}
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.event_date ? `When: ${p.event_date}` : ""}</span>
                {p.source && <span>via {p.source}</span>}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
