import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getLeaveStatus, performLeaveWaitlist } from "@/lib/leave-waitlist.functions";

type Search = { t?: string };

/**
 * The leave token arrives in the URL fragment (`#t=…`), which browsers never
 * put in the HTTP request, so it cannot reach hosting or proxy access logs.
 * On load we read it, immediately rewrite the URL to a bare path, and keep the
 * raw token in memory only. `?t=` is still accepted for links already sent.
 */
export const Route = createFileRoute("/leave-waitlist")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    t: typeof s.t === "string" ? s.t : undefined,
  }),
  headers: () => ({
    "cache-control": "no-store, no-cache, must-revalidate, private",
    "referrer-policy": "no-referrer",
  }),
  head: () => ({
    meta: [
      { title: "Leave the OwnWay waitlist" },
      {
        name: "description",
        content: "Remove yourself from the OwnWay waitlist and delete your waitlist data.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: LeaveWaitlistPage,
});

function LeaveWaitlistPage() {
  const search = Route.useSearch();
  const readStatus = useServerFn(getLeaveStatus);
  const doLeave = useServerFn(performLeaveWaitlist);

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("invalid");
  const [masked, setMasked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raw: string | null = search.t ?? null;
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#/, "");
      const fromHash = new URLSearchParams(hash).get("t");
      if (fromHash) raw = fromHash;
      if (fromHash || search.t) {
        window.history.replaceState(null, "", "/leave-waitlist");
      }
    }
    if (!raw) {
      setLoading(false);
      return;
    }
    setToken(raw);
    // Read-only: opening this link never deletes anything.
    readStatus({ data: { token: raw } })
      .then((r) => {
        setStatus(r.status);
        setMasked(r.masked_email);
      })
      .catch(() => setStatus("invalid"))
      .finally(() => setLoading(false));
  }, []);

  const onLeave = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const r = await doLeave({ data: { token } });
      if (r.status === "deleted") {
        setDone(true);
        setToken(null);
      } else {
        setStatus(r.status);
      }
    } catch {
      setStatus("invalid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-20">
        <div className="mx-auto max-w-lg rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft">
          {done ? (
            <>
              <CheckCircle2 className="mx-auto size-10 text-accent" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">You've left the OwnWay waitlist</h1>
              <p className="mt-3 text-muted-foreground">
                Your waitlist data has been deleted. You're welcome to join again
                any time.
              </p>
              <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8">
                <Link to="/">Back to OwnWay</Link>
              </Button>
            </>
          ) : loading ? (
            <p className="text-muted-foreground">Checking your link…</p>
          ) : status === "valid" ? (
            <>
              <Trash2 className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">Leave the OwnWay waitlist?</h1>
              <p className="mt-3 text-muted-foreground">
                This will remove you from the OwnWay waitlist and delete your
                waitlist data. This cannot be undone.
              </p>
              {masked ? (
                <p className="mt-2 text-sm text-muted-foreground">For {masked}</p>
              ) : null}
              <Button
                size="lg"
                variant="destructive"
                className="mt-7 h-12 rounded-full px-8"
                onClick={onLeave}
                disabled={submitting}
              >
                {submitting ? "Deleting…" : "Leave waitlist and delete my data"}
              </Button>
              <div className="mt-4">
                <Link to="/" className="text-sm text-muted-foreground underline">
                  Never mind, keep my place
                </Link>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">
                {status === "already_used"
                  ? "This link has already been used"
                  : status === "expired"
                    ? "This link has expired"
                    : "This link isn't valid"}
              </h1>
              <p className="mt-3 text-muted-foreground">
                Open your waitlist page and choose "Leave the waitlist" to have a
                fresh link sent to your email address.
              </p>
              <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8">
                <Link to="/">Back to OwnWay</Link>
              </Button>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
