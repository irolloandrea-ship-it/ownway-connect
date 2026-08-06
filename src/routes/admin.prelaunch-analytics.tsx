import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { adminGrantSelfAdmin, adminPrelaunchAnalytics } from "@/lib/admin.functions";
import { LogOut, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/prelaunch-analytics")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "OwnWay — Pre-launch Analytics" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PrelaunchAnalyticsPage,
});

function PrelaunchAnalyticsPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const grantSelf = useServerFn(adminGrantSelfAdmin);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth", search: { next: undefined } });
        return;
      }
      try {
        const r = await grantSelf();
        if (r.granted || r.alreadyAdmin) setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      }
      setReady(true);
    })();
  }, [navigate, grantSelf]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { next: undefined } });
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container-page py-20 text-center">
          <h1 className="text-3xl">You don't have admin access</h1>
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
            <h1 className="mt-2 font-display text-4xl">Pre-launch analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <Link to="/admin" className="underline">Back to waitlist</Link>
            </p>
          </div>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="mr-1.5 size-4" /> Sign out
          </Button>
        </div>
        <Panel />
      </main>
      <SiteFooter />
    </div>
  );
}

function Panel() {
  const fn = useServerFn(adminPrelaunchAnalytics);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-prelaunch-analytics"],
    queryFn: () => fn(),
  });

  if (isLoading || !data) {
    return <div className="py-16 text-center text-muted-foreground">Loading…</div>;
  }

  const { totals, sources, recent } = data;
  const pct = (n: number, d: number) => (d > 0 ? ((n / d) * 100).toFixed(1) + "%" : "—");
  const conversion = pct(totals.signups, totals.pageViews);
  const ctr = pct(totals.ctaClicks, totals.pageViews);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`mr-1.5 size-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Page visits" value={totals.pageViews} />
        <Stat label="CTA clicks" value={totals.ctaClicks} />
        <Stat label="Email sign-ups" value={totals.signups} />
        <Stat label="Conversion rate" value={conversion} />
        <Stat label="CTA click-through" value={ctr} />
      </div>

      <Section title="Source performance">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Page visits</th>
                <th className="px-4 py-3">CTA clicks</th>
                <th className="px-4 py-3">Sign-ups</th>
                <th className="px-4 py-3">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {sources.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No events yet.</td></tr>
              )}
              {sources.map((s: any) => (
                <tr key={s.source} className="border-t border-border/40">
                  <td className="px-4 py-3 font-medium">{s.source}</td>
                  <td className="px-4 py-3">{s.page_views}</td>
                  <td className="px-4 py-3">{s.cta_clicks}</td>
                  <td className="px-4 py-3">{s.email_signups}</td>
                  <td className="px-4 py-3">{pct(s.email_signups, s.page_views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Recent events">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Button</th>
                <th className="px-4 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No events yet.</td></tr>
              )}
              {recent.map((r: any, i: number) => (
                <tr key={i} className="border-t border-border/40">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.event_name}</td>
                  <td className="px-4 py-3">{r.source ?? "—"}</td>
                  <td className="px-4 py-3">{r.utm_campaign ?? "—"}</td>
                  <td className="px-4 py-3">{r.button_text ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email_normalized ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-soft">
      <div className="border-b border-border/60 p-4">
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
