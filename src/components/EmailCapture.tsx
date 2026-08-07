import { useEffect, useId, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { submitEarlyAccess } from "@/lib/early-access.functions";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";
import { CONSENT_POLICY_VERSION, trackAnalyticsEvent } from "@/lib/cookie-consent";
import { captureReferralCode, clearReferralCode, getStoredReferralCode } from "@/lib/referral-code";

export function EmailCapture({
  referredBy,
  intendedRole,
  id,
  cta = "Get Early Access",
  location = "hero_section",
  className,
}: {
  referredBy?: string;
  intendedRole?: "explorer" | "waymaker";
  id?: string;
  cta?: string;
  location?: string;
  className?: string;
}) {
  const submit = useServerFn(submitEarlyAccess);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"explorer" | "waymaker" | null>(intendedRole ?? null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const consentId = useId();
  const errorId = `${consentId}-error`;

  useEffect(() => {
    if (intendedRole) setRole(intendedRole);
  }, [intendedRole]);

  useEffect(() => {
    trackAnalyticsEvent("waitlist_form_viewed", { location });
  }, [location]);

  useEffect(() => {
    if (consent && consentError) setConsentError(false);
  }, [consent, consentError]);

  const selectRole = (next: "explorer" | "waymaker") => {
    setRole(next);
    trackAnalyticsEvent("interest_selected", { role: next, location });
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!role) return toast.error("Please choose Traveler or WayMaker");
    if (!consent) {
      setConsentError(true);
      toast.error("Please confirm your email consent to continue");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          email,
          role,
          source: typeof window !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: getStoredReferralCode() ?? captureReferralCode(referredBy) ?? null,
          consent_marketing: true,
          consent_policy_version: CONSENT_POLICY_VERSION,
          consent_source: location,
        },
      });
      clearReferralCode();
      void trackPrelaunchEvent("email_signup", {
        metadata: { role, already: res.already ?? false, location },
      });
      trackAnalyticsEvent("waitlist_form_submitted", { role, location });
      navigate({
        to: "/waitlist/$code",
        params: { code: res.referral_code },
        search: { role, ...(res.already ? { already: true as const } : {}) },
      });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not sign you up");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={onSubmit} noValidate className={`w-full space-y-3 ${className ?? ""}`}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="h-12 flex-1 rounded-full px-5 text-base"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mr-2">
          I want to join as
        </p>
        <div className="inline-flex rounded-full border border-border/70 bg-card p-1 shadow-soft">
          <button
            type="button"
            onClick={() => selectRole("explorer")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "explorer" ? "bg-ink text-background" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "explorer"}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => selectRole("waymaker")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "waymaker" ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "waymaker"}
          >
            WayMaker
          </button>
        </div>
      </div>

      <div
        className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
          consentError ? "border-destructive/60 bg-destructive/5" : "border-border/60 bg-card/60"
        }`}
      >
        <Checkbox
          id={consentId}
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-invalid={consentError || undefined}
          aria-describedby={consentError ? errorId : undefined}
          className="mt-0.5"
        />
        <div className="flex-1 text-sm leading-relaxed text-foreground/85">
          <label htmlFor={consentId} className="cursor-pointer">
            I agree to receive OwnWay early-access and launch updates. I can
            unsubscribe at any time.
          </label>{" "}
          <Link
            to="/privacy"
            className="text-accent underline-offset-2 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </Link>
          .
          {consentError && (
            <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
              Please tick this box to receive OwnWay updates.
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-full px-6"
        disabled={submitting}
        onClick={() =>
          trackPrelaunchEvent("cta_click", {
            button_text: cta,
            button_location: location,
          })
        }
      >
        {submitting ? "Saving…" : cta} <ArrowRight className="ml-1.5 size-4" />
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        You can withdraw consent anytime via the unsubscribe link in every
        email or by emailing{" "}
        <a
          href="mailto:theownwayapp@gmail.com"
          className="text-accent underline-offset-2 hover:underline"
        >
          theownwayapp@gmail.com
        </a>
        .
      </p>
    </form>
  );
}
