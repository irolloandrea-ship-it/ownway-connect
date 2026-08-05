import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getWaitlistStatus, updateSignup } from "@/lib/early-access.functions";
import { Check, Copy, Link as LinkIcon } from "lucide-react";

type Search = { role?: "explorer" | "waymaker"; already?: boolean };

export const Route = createFileRoute("/waitlist/$code")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    role: s.role === "explorer" || s.role === "waymaker" ? s.role : undefined,
    already: s.already === true || s.already === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "You're on the OwnWay waitlist" },
      { name: "description", content: "Move up the OwnWay waitlist by inviting friends." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WaitlistPage,
});

function WaitlistPage() {
  const { code } = Route.useParams();
  const search = useSearch({ from: "/waitlist/$code" });
  const fetchStatus = useServerFn(getWaitlistStatus);
  const saveSignup = useServerFn(updateSignup);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getWaitlistStatus>> | null>(null);
  const [role, setRole] = useState<"explorer" | "waymaker" | "curious" | "unknown">("unknown");
  const [destination, setDestination] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStatus({ data: { referral_code: code } })
      .then((r) => {
        setStatus(r);
        setRole((search.role ?? (r.role as any)) || "unknown");
        setDestination(r.destination ?? "");
        setConsent(r.consent_to_updates);
      })
      .catch(() => toast.error("We couldn't find that waitlist entry."))
      .finally(() => setLoading(false));
  }, [code]);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?ref=${code}` : `https://ownway-connect.lovable.app/?ref=${code}`;
  const shareText = "I'm on the OwnWay early-access list. Join through my invite link:";

  const [canShare, setCanShare] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setLiveMessage("Invite link copied to clipboard.");
      setTimeout(() => setCopied(false), 1800);
      return true;
    } catch {
      setShowUrlFallback(true);
      setLiveMessage("Copy this link to share it.");
      return false;
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: "OwnWay", text: shareText, url: shareUrl });
    } catch (err: any) {
      if (err?.name === "AbortError") return; // user cancelled — normal
      await copy();
    }
  };


  const save = async () => {
    setSaving(true);
    try {
      await saveSignup({
        data: {
          referral_code: code,
          role,
          destination: destination || null,
          consent_to_updates: consent,
        },
      });
      toast.success("Saved.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="rounded-3xl border border-border/60 bg-card p-10 text-center text-muted-foreground shadow-card">
              Loading your spot…
            </div>
          ) : !status ? (
            <div className="rounded-3xl border border-border/60 bg-card p-10 text-center shadow-card">
              <p>We couldn't find that waitlist entry.</p>
              <Link to="/" className="mt-4 inline-block text-sm text-gold hover:underline">
                Back to the homepage
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                  <Check className="size-6 text-gold" />
                </div>
                <h1 className="mt-6 font-display text-4xl md:text-5xl">
                  {search.already ? "You're already in!" : "Thank you!"}
                </h1>
                <p className="mt-3 text-muted-foreground">
                  {search.already
                    ? "This email is already on the OwnWay early access queue. Here's your spot and referral link — share it to move up."
                    : "We have added your email address to the OwnWay early access queue."}
                </p>
              </div>

              {/* Position card */}
              <div className="mx-auto mt-10 max-w-md rounded-3xl border border-border/60 bg-secondary/40 p-8 text-center shadow-card">
                <p className="font-display text-5xl tracking-tight">#{status.position}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">on the waitlist</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  Reservation held for <span className="text-foreground">{status.email}</span>
                </p>
              </div>

              {/* Referral */}
              <div className="mt-12 text-center">
                <h2 className="font-display text-2xl">Want priority access?</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Move up the waitlist by inviting your friends. Each signup through your link moves you ~5 places higher.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  You've referred <span className="font-semibold text-foreground">{status.referral_count}</span>{" "}
                  {status.referral_count === 1 ? "person" : "people"} so far.
                </p>

                <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3">
                  {canShare && (
                    <Button type="button" size="lg" className="h-12 w-full rounded-full text-base" onClick={share}>
                      <Share2 className="mr-2 size-4" />
                      Share your OwnWay invite
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="lg"
                    variant={canShare ? "outline" : "default"}
                    className="h-12 w-full rounded-full text-base"
                    onClick={copy}
                  >
                    {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                    {copied ? "Link copied" : "Copy invite link"}
                  </Button>

                  <p aria-live="polite" className="sr-only">
                    {liveMessage}
                  </p>

                  {showUrlFallback ? (
                    <div className="mt-2 rounded-2xl border border-border/60 bg-card p-4 text-left">
                      <Label htmlFor="referral-url" className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <LinkIcon className="size-3.5" /> Copy this link to share it
                      </Label>
                      <Input
                        id="referral-url"
                        readOnly
                        value={shareUrl}
                        onFocus={(e) => e.currentTarget.select()}
                        className="mt-2 font-mono text-sm"
                      />
                    </div>
                  ) : (
                    <Input
                      readOnly
                      value={shareUrl}
                      aria-label="Your unique referral link"
                      onFocus={(e) => e.currentTarget.select()}
                      className="mt-1 h-9 border-transparent bg-transparent text-center font-mono text-xs text-muted-foreground"
                    />
                  )}
                </div>

              </div>

            </>

          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
