import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import {
  adminAnalytics, adminApproveWaymaker, adminAssignMatches, adminDeleteFeedPost,
  adminExportWaitlistCsv,
  adminGrantSelfAdmin, adminListApplications, adminListFeed, adminListFeedback,
  adminListProfiles, adminListTrips, adminUpdateApplicationStatus, adminUpsertFeedPost,
} from "@/lib/admin.functions";

import { Copy, LogOut, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "OwnWay Admin Panel" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const grantSelf = useServerFn(adminGrantSelfAdmin);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate({ to: "/auth" }); return; }
      try {
        const r = await grantSelf();
        if (r.granted || r.alreadyAdmin) setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      }
      setReady(true);
    })();
  }, [navigate, grantSelf]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  if (!ready) return <div className="min-h-screen bg-background"><SiteHeader /><div className="container-page py-20 text-center text-muted-foreground">Loading…</div></div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background"><SiteHeader />
        <main className="container-page py-20 text-center">
          <h1 className="text-3xl">You don't have admin access</h1>
          <p className="mt-3 text-muted-foreground">Ask the OwnWay admin to grant your account access.</p>
          <Button className="mt-6 rounded-full" onClick={signOut}>Sign out</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin</p>
            <h1 className="mt-2 font-display text-4xl">OwnWay Admin Panel</h1>
          </div>
          <Button variant="ghost" onClick={signOut}><LogOut className="mr-1.5 size-4" /> Sign out</Button>
        </div>

        <Tabs defaultValue="trips" className="mt-8">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="trips">Trip Requests</TabsTrigger>
            <TabsTrigger value="apps">WayMaker Apps</TabsTrigger>
            <TabsTrigger value="match">Matching Workspace</TabsTrigger>
            <TabsTrigger value="feed">City Feed</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & Scores</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>
          <TabsContent value="trips"><TripsTab /></TabsContent>
          <TabsContent value="apps"><AppsTab /></TabsContent>
          <TabsContent value="match"><MatchingTab /></TabsContent>
          <TabsContent value="feed"><FeedTab /></TabsContent>
          <TabsContent value="feedback"><FeedbackTab /></TabsContent>
          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
          <TabsContent value="waitlist"><WaitlistTab /></TabsContent>

        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

function TripsTab() {
  const fn = useServerFn(adminListTrips);
  const { data = [] } = useQuery({ queryKey: ["admin-trips"], queryFn: () => fn() });
  const [open, setOpen] = useState<any | null>(null);
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
        <h2 className="text-lg">Trip requests ({data.length})</h2>
        <div className="mt-3 max-h-[70vh] divide-y divide-border/60 overflow-y-auto">
          {data.map((t: any) => (
            <button key={t.id} onClick={() => setOpen(t)} className={`block w-full py-3 text-left text-sm hover:bg-secondary/40 ${open?.id === t.id ? "bg-accent/40" : ""}`}>
              <div className="flex items-center justify-between px-2">
                <span className="font-medium">{t.destination_city}</span>
                <span className="text-xs text-muted-foreground">{t.status}</span>
              </div>
              <div className="px-2 text-xs text-muted-foreground">{t.first_name ?? "—"} · {t.email} · {new Date(t.created_at).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        {!open ? <p className="text-sm text-muted-foreground">Select a trip request to see details.</p> : (
          <div className="space-y-4 text-sm">
            <h2 className="font-display text-2xl">{open.destination_city}</h2>
            <p className="text-muted-foreground">{open.first_name} · {open.email}</p>
            <p>Duration: {open.trip_duration} · Group: {open.travel_group ?? "—"}</p>
            <p>Budget: {open.budget_style ?? "—"} · Languages: {(open.preferred_languages ?? []).join(", ")}</p>
            <p>Interests: {(open.interests ?? []).join(", ")}</p>
            <div>
              <Label>Matching prompt packet</Label>
              <Textarea readOnly rows={10} className="mt-1 font-mono text-xs" value={open.matching_prompt_packet ?? ""} />
              <Button size="sm" variant="outline" className="mt-2 rounded-full" onClick={() => { navigator.clipboard.writeText(open.matching_prompt_packet ?? ""); toast.success("Copied"); }}>
                <Copy className="mr-1.5 size-3" /> Copy packet
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Private Trip Space: <Link className="underline" to="/trip/$token" params={{ token: open.private_trip_space_token }}>{open.private_trip_space_token.slice(0, 12)}…</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppsTab() {
  const listFn = useServerFn(adminListApplications);
  const approveFn = useServerFn(adminApproveWaymaker);
  const updateFn = useServerFn(adminUpdateApplicationStatus);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-apps"], queryFn: () => listFn() });
  const [busy, setBusy] = useState<string | null>(null);

  const approve = async (id: string) => {
    setBusy(id);
    try { await approveFn({ data: { applicationId: id, level: "WayMaker" } }); toast.success("Approved"); qc.invalidateQueries({ queryKey: ["admin-apps"] }); qc.invalidateQueries({ queryKey: ["admin-profiles"] }); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); } finally { setBusy(null); }
  };
  const setStatus = async (id: string, status: string) => {
    try { await updateFn({ data: { id, status } }); toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-apps"] }); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <div className="mt-6 space-y-4">
      {data.map((a: any) => (
        <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl">{a.first_name}</h3>
              <p className="text-sm text-muted-foreground">{a.email} · {a.main_location} · {(a.languages ?? []).join(", ")}</p>
              <p className="mt-1 text-xs text-muted-foreground">Status: {a.status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {a.status !== "approved" && <Button size="sm" disabled={busy === a.id} onClick={() => approve(a.id)} className="rounded-full">Approve</Button>}
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(a.id, "needs_more_info")}>Needs info</Button>
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(a.id, "rejected")}>Reject</Button>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            <p><strong>Destinations:</strong> {(a.destinations ?? []).map((d: any) => `${d.city}${d.country ? ", " + d.country : ""} (${d.confidence_level}/5)`).join(" · ") || "—"}</p>
            <p><strong>Style tags:</strong> {(a.travel_style_tags ?? []).join(", ")}</p>
            <p className="md:col-span-2"><strong>Motivation:</strong> {a.motivation_text}</p>
            <p className="md:col-span-2"><strong>Useful advice:</strong> {a.useful_advice_text}</p>
          </div>
        </div>
      ))}
      {data.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
    </div>
  );
}

function MatchingTab() {
  const tripsFn = useServerFn(adminListTrips);
  const profilesFn = useServerFn(adminListProfiles);
  const assignFn = useServerFn(adminAssignMatches);
  const qc = useQueryClient();
  const { data: trips = [] } = useQuery({ queryKey: ["admin-trips"], queryFn: () => tripsFn() });
  const { data: profiles = [] } = useQuery({ queryKey: ["admin-profiles"], queryFn: () => profilesFn() });
  const pending = trips.filter((t: any) => t.status === "matching_pending");
  const [selected, setSelected] = useState<string | null>(null);
  const trip = trips.find((t: any) => t.id === selected);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");

  const togglePick = (id: string) => setPicks((p) => { const n = { ...p }; if (n[id] != null) delete n[id]; else if (Object.keys(n).length < 3) n[id] = ""; return n; });

  const assign = async () => {
    if (!trip) return;
    const matches = Object.entries(picks).map(([waymaker_profile_id, admin_match_reason]) => ({ waymaker_profile_id, admin_match_reason }));
    if (matches.length === 0) { toast.error("Pick at least one WayMaker"); return; }
    try {
      await assignFn({ data: { tripId: trip.id, matches, adminNote: note || null } });
      toast.success("Matches assigned");
      setPicks({}); setNote(""); setSelected(null);
      qc.invalidateQueries({ queryKey: ["admin-trips"] });
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const copyEmail = () => {
    if (!trip) return;
    const names = Object.keys(picks).map((id) => profiles.find((p: any) => p.id === id)?.public_name).filter(Boolean).join(", ");
    const url = `${window.location.origin}/trip/${trip.private_trip_space_token}`;
    const body = `Hi ${trip.first_name ?? "there"},\n\nWe've prepared your OwnWay match for ${trip.destination_city}. Based on your trip profile, we suggest: ${names}.\n\nYou can view their profiles and tell us your preferred WayMaker in your private Trip Space:\n${url}\n\nWarmly,\nOwnWay`;
    navigator.clipboard.writeText(body); toast.success("Email copied");
  };

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
        <h2 className="text-sm font-medium">Matching pending ({pending.length})</h2>
        <div className="mt-2 divide-y divide-border/60">
          {pending.map((t: any) => (
            <button key={t.id} onClick={() => { setSelected(t.id); setPicks({}); setNote(""); }} className={`block w-full py-3 text-left text-sm ${selected === t.id ? "text-foreground" : "text-muted-foreground"}`}>
              <div className="font-medium">{t.destination_city}</div>
              <div className="text-xs">{t.first_name ?? "—"} · {t.trip_duration}</div>
            </button>
          ))}
          {pending.length === 0 && <p className="py-3 text-sm text-muted-foreground">All caught up.</p>}
        </div>
      </div>
      <div>
        {!trip ? <p className="text-sm text-muted-foreground">Select a trip to match.</p> : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <h3 className="font-display text-2xl">{trip.destination_city}</h3>
              <p className="text-sm text-muted-foreground">{trip.first_name} · {trip.trip_duration}</p>
              <p className="mt-3 text-sm">Budget: {trip.budget_style ?? "—"} · Languages: {(trip.preferred_languages ?? []).join(", ")}</p>
              <p className="mt-1 text-sm">Interests: {(trip.interests ?? []).join(", ")}</p>
              <Textarea readOnly className="mt-3 font-mono text-xs" rows={8} value={trip.matching_prompt_packet ?? ""} />
            </section>
            <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <h3 className="font-display text-2xl">Pick up to 3 WayMakers</h3>
              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
                {profiles.map((p: any) => (
                  <label key={p.id} className={`flex items-start gap-3 rounded-xl border p-3 ${picks[p.id] != null ? "border-gold bg-accent/40" : "border-border"}`}>
                    <Checkbox checked={picks[p.id] != null} onCheckedChange={() => togglePick(p.id)} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.public_name} <span className="text-xs text-muted-foreground">· {p.main_location}</span></p>
                      <p className="text-xs text-muted-foreground">{(p.travel_style_tags ?? []).join(", ")}</p>
                      {picks[p.id] != null && (
                        <Textarea className="mt-2 text-xs" rows={2} placeholder="Why this WayMaker fits this trip…" value={picks[p.id]} onChange={(e) => setPicks((prev) => ({ ...prev, [p.id]: e.target.value }))} />
                      )}
                    </div>
                  </label>
                ))}
                {profiles.length === 0 && <p className="text-sm text-muted-foreground">Approve some WayMaker applications first.</p>}
              </div>
              <Label className="mt-4 block">Admin note to Explorer (optional)</Label>
              <Textarea className="mt-1" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="mt-4 flex gap-2">
                <Button onClick={assign} className="rounded-full">Assign selected WayMakers</Button>
                <Button variant="outline" onClick={copyEmail} className="rounded-full"><Copy className="mr-1.5 size-4" /> Copy email message</Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const CATS = ["Events", "Food", "Culture", "Nightlife", "Transport", "Warnings", "Seasonal", "Sport", "Other"];
function FeedTab() {
  const listFn = useServerFn(adminListFeed);
  const upsertFn = useServerFn(adminUpsertFeedPost);
  const delFn = useServerFn(adminDeleteFeedPost);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-feed"], queryFn: () => listFn() });
  const [draft, setDraft] = useState({ city: "", country: "", category: "Events", title: "", description: "", event_date: "", expiration_date: "", source: "", status: "approved" });

  const save = async () => {
    try {
      await upsertFn({ data: { ...draft, country: draft.country || null, description: draft.description || null, event_date: draft.event_date || null, expiration_date: draft.expiration_date || null, source: draft.source || null } });
      toast.success("Saved");
      setDraft({ ...draft, title: "", description: "" });
      qc.invalidateQueries({ queryKey: ["admin-feed"] });
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const remove = async (id: string) => { try { await delFn({ data: { id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-feed"] }); } catch (e: any) { toast.error(e?.message); } };
  const setStatus = async (id: string, post: any, status: string) => {
    try { await upsertFn({ data: { id, city: post.city, country: post.country, category: post.category, title: post.title, description: post.description, event_date: post.event_date, expiration_date: post.expiration_date, source: post.source, status } }); toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-feed"] }); }
    catch (e: any) { toast.error(e?.message); }
  };

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h2 className="text-lg">New post</h2>
        <div className="mt-3 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>City</Label><Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></div>
            <div><Label>Country</Label><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></div>
          </div>
          <div><Label>Category</Label><Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Title</Label><Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Event date</Label><Input type="date" value={draft.event_date} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })} /></div>
            <div><Label>Expires</Label><Input type="date" value={draft.expiration_date} onChange={(e) => setDraft({ ...draft, expiration_date: e.target.value })} /></div>
          </div>
          <div><Label>Source</Label><Input value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} /></div>
          <Button onClick={save} className="rounded-full">Publish</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h2 className="text-lg">Posts</h2>
        <div className="mt-3 max-h-[70vh] divide-y divide-border/60 overflow-y-auto">
          {data.map((p: any) => (
            <div key={p.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.city} · {p.category} · {p.status}</p>
                </div>
                <div className="flex gap-1">
                  {p.status !== "approved" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(p.id, p, "approved")}>Approve</Button>}
                  {p.status !== "rejected" && <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setStatus(p.id, p, "rejected")}>Reject</Button>}
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="py-3 text-sm text-muted-foreground">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
}

function FeedbackTab() {
  const fn = useServerFn(adminListFeedback);
  const { data = [] } = useQuery({ queryKey: ["admin-feedback"], queryFn: () => fn() });
  const internal = data.filter((f: any) => f.internal_match_score != null);
  const way = data.filter((f: any) => f.overall_experience_score != null);
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h2 className="text-lg">MatchScore (internal)</h2>
        <p className="text-xs text-muted-foreground">Improves matching. Does not affect WayMaker reputation.</p>
        <div className="mt-3 space-y-3">
          {internal.map((f: any) => (
            <div key={f.id} className="rounded-xl border border-border/60 p-3 text-sm">
              <p><strong>{f.explorer_trip_requests?.destination_city}</strong> · {f.explorer_trip_requests?.first_name ?? "—"} · {f.waymaker_profiles?.public_name ?? "—"}</p>
              <p>Match: {f.internal_match_score}/5</p>
              {f.internal_match_feedback && <p className="mt-1 text-muted-foreground">"{f.internal_match_feedback}"</p>}
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h2 className="text-lg">WayScore (reputation)</h2>
        <div className="mt-3 space-y-3">
          {way.map((f: any) => (
            <div key={f.id} className="rounded-xl border border-border/60 p-3 text-sm">
              <p><strong>{f.waymaker_profiles?.public_name ?? "—"}</strong> for {f.explorer_trip_requests?.destination_city}</p>
              <p>Understanding {f.understanding_score} · Advice {f.advice_quality_score} · Accuracy {f.accuracy_score} · Usefulness {f.usefulness_score} · Overall {f.overall_experience_score}</p>
              {f.most_useful_text && <p className="mt-1">Most useful: {f.most_useful_text}</p>}
              {f.public_review_permission && <p className="mt-1 text-gold">✓ Public review allowed</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalyticsTab() {
  const fn = useServerFn(adminAnalytics);
  const { data } = useQuery({ queryKey: ["admin-analytics"], queryFn: () => fn() });
  if (!data) return <p className="mt-6 text-sm text-muted-foreground">Loading…</p>;
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <Stat label="Trip requests" value={data.tripCount} />
      <Stat label="WayMaker applications" value={data.applicationCount} />
      <Stat label="Approved WayMakers" value={data.approvedWaymakerCount} />
      <Stat label="Matched trips" value={data.matchedCount} />
      <Stat label="Avg MatchScore" value={data.avgInternalMatch?.toFixed?.(2) ?? "—"} />
      <Stat label="Avg WayScore" value={data.avgWayScore?.toFixed?.(2) ?? "—"} />
      <Stat label="Feedback submissions" value={data.feedbackCount} />
      <Stat label="% rated 4–5" value={`${data.highRatePct}%`} />
      <div className="md:col-span-3 grid gap-4 md:grid-cols-2">
        <ListCard title="Most requested destinations" items={data.topCities} />
        <ListCard title="Most common interests" items={data.topInterests} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl">{value ?? "—"}</p>
    </div>
  );
}
function ListCard({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {items.length === 0 && <li className="text-muted-foreground">No data yet.</li>}
        {items.map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="text-muted-foreground">{v}</span></li>)}
      </ul>
    </div>
  );
}
