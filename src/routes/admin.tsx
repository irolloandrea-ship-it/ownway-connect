import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  adminExportWaitlistCsv,
  adminGrantSelfAdmin,
  adminListWaitlist,
} from "@/lib/admin.functions";
import { LogOut, Download, RefreshCw } from "lucide-react";

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
            <h1 className="mt-2 font-display text-4xl">Early access waitlist</h1>
          </div>
          <Button variant="ghost" onClick={signOut}><LogOut className="mr-1.5 size-4" /> Sign out</Button>
        </div>
        <WaitlistPanel />
      </main>
      <SiteFooter />
    </div>
  );
}

function WaitlistPanel() {
  const listFn = useServerFn(adminListWaitlist);
  const exportFn = useServerFn(adminExportWaitlistCsv);
  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-waitlist"],
    queryFn: () => listFn(),
  });
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const { csv, count } = await exportFn();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ownway-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${count} signup${count === 1 ? "" : "s"}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to export");
    } finally {
      setBusy(false);
    }
  };

  const travelers = data.filter((r: any) => r.role === "explorer" || r.role === "traveler").length;
  const waymakers = data.filter((r: any) => r.role === "waymaker").length;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total signups" value={data.length} />
        <Stat label="Travelers" value={travelers} />
        <Stat label="WayMakers" value={waymakers} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4">
          <p className="text-sm text-muted-foreground">
            Sorted by waitlist position (referrals move people up).
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-1.5 size-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button size="sm" className="rounded-full" onClick={download} disabled={busy || data.length === 0}>
              <Download className="mr-1.5 size-4" /> {busy ? "Preparing…" : "Download CSV"}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Referrals</th>
                <th className="px-4 py-3">Referred by</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!isLoading && data.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No signups yet.</td></tr>
              )}
              {data.map((r: any, i: number) => (
                <tr key={r.email + i} className="border-t border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3 font-medium">{i + 1}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3 capitalize">{r.role === "explorer" ? "traveler" : r.role ?? "—"}</td>
                  <td className="px-4 py-3">{r.destination ?? "—"}</td>
                  <td className="px-4 py-3">{r.referral_count ?? 0}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.referred_by ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.referral_code ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}
