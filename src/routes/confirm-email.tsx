import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, MailCheck, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { confirmEmail, getConfirmEmailStatus } from "@/lib/confirm-email.functions";

type Search = { t?: string };

export const Route = createFileRoute("/confirm-email")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    t: typeof s.t === "string" ? s.t : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Confirm your email — OwnWay" },
      {
        name: "description",
        content: "Confirm your email address to secure your place on the OwnWay waitlist.",
      },
      { property: "og:title", content: "Confirm your email — OwnWay" },
      {
        property: "og:description",
        content: "Confirm your email address to secure your place on the OwnWay waitlist.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmEmailPage,
});

function ConfirmEmailPage() {
  const { t } = Route.useSearch();
  const readStatus = useServerFn(getConfirmEmailStatus);
  const doConfirm = useServerFn(confirmEmail);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("invalid");
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (!t) {
      setLoading(false);
      return;
    }
    // GET only — reading the link never confirms anything (scanner-safe).
    readStatus({ data: { token: t } })
      .then((r) => setStatus(r.status))
      .catch(() => setStatus("invalid"))
      .finally(() => setLoading(false));
  }, [t]);

  const onConfirm = async () => {
    if (!t) return;
    setSubmitting(true);
    try {
      const r = await doConfirm({ data: { token: t } });
      setStatus(r.status === "confirmed" || r.status === "already" ? "already" : r.status);
      setCode(r.referral_code);
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
          {loading ? (
            <p className="text-muted-foreground">Checking your link…</p>
          ) : status === "pending" ? (
            <>
              <MailCheck className="mx-auto size-10 text-accent" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">Confirm your email</h1>
              <p className="mt-3 text-muted-foreground">
                Confirming secures your place on the OwnWay waitlist. Until you confirm,
                your place is not reserved.
              </p>
              <Button
                size="lg"
                className="mt-7 h-12 rounded-full px-8"
                onClick={onConfirm}
                disabled={submitting}
              >
                {submitting ? "Confirming…" : "Confirm my place"}
              </Button>
            </>
          ) : status === "already" ? (
            <>
              <CheckCircle2 className="mx-auto size-10 text-accent" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">You're confirmed</h1>
              <p className="mt-3 text-muted-foreground">
                Your place on the OwnWay waitlist is secured.
              </p>
              {code ? (
                <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8">
                  <Link to="/waitlist/$code" params={{ code }}>
                    See your waitlist page
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline" className="mt-7 h-12 rounded-full px-8">
                  <Link to="/">Back to OwnWay</Link>
                </Button>
              )}
            </>
          ) : status === "expired" ? (
            <>
              <AlertCircle className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">This link has expired</h1>
              <p className="mt-3 text-muted-foreground">
                Sign up again with the same email and we'll send you a fresh confirmation link.
              </p>
              <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8">
                <Link to="/">Back to OwnWay</Link>
              </Button>
            </>
          ) : (
            <>
              <AlertCircle className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
              <h1 className="mt-5 text-2xl">We couldn't check that link</h1>
              <p className="mt-3 text-muted-foreground">
                The confirmation link looks invalid. Please use the most recent email we sent you.
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
