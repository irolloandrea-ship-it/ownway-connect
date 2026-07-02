import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

type Search = { token?: string };

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Unsubscribe — OwnWay" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "already" }
  | { kind: "ready" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

function UnsubscribePage() {
  const { token } = useSearch({ from: "/unsubscribe" });
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return setState({ kind: "invalid" });
        if (data.valid === false && data.reason === "already_unsubscribed") {
          return setState({ kind: "already" });
        }
        if (data.valid) return setState({ kind: "ready" });
        setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "invalid" }));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (data.success) return setState({ kind: "done" });
      if (data.reason === "already_unsubscribed") return setState({ kind: "already" });
      setState({ kind: "error", message: data.error ?? "Something went wrong." });
    } catch {
      setState({ kind: "error", message: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-md rounded-3xl border border-border/60 bg-card p-10 text-center shadow-card">
          {state.kind === "loading" && (
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Checking your link…
            </p>
          )}
          {state.kind === "invalid" && (
            <>
              <h1 className="font-display text-3xl">Link not valid</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                This unsubscribe link is invalid or has expired.
              </p>
              <Link to="/" className="mt-6 inline-block text-sm text-gold hover:underline">
                Back to OwnWay
              </Link>
            </>
          )}
          {state.kind === "already" && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                <Check className="size-6 text-gold" />
              </div>
              <h1 className="mt-6 font-display text-3xl">You're already unsubscribed</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                You won't receive any more emails from OwnWay.
              </p>
            </>
          )}
          {state.kind === "ready" && (
            <>
              <h1 className="font-display text-3xl">Unsubscribe from OwnWay</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Confirm below and we'll stop sending you emails.
              </p>
              <Button size="lg" className="mt-6 rounded-full" onClick={confirm}>
                Confirm unsubscribe
              </Button>
            </>
          )}
          {state.kind === "submitting" && (
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Unsubscribing…
            </p>
          )}
          {state.kind === "done" && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                <Check className="size-6 text-gold" />
              </div>
              <h1 className="mt-6 font-display text-3xl">You're unsubscribed</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We won't email you again. Sorry to see you go.
              </p>
            </>
          )}
          {state.kind === "error" && (
            <>
              <h1 className="font-display text-3xl">Something went wrong</h1>
              <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
              <Button className="mt-6 rounded-full" onClick={confirm}>
                Try again
              </Button>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
