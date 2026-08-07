import { useEffect, useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitEarlyAccess } from "@/lib/early-access.functions";
import { CONSENT_POLICY_VERSION, trackAnalyticsEvent } from "@/lib/cookie-consent";
import { captureReferralCode, clearReferralCode, getStoredReferralCode } from "@/lib/referral-code";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

type Role = "explorer" | "waymaker";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function JoinEarlyAccess({
  children,
  referredBy,
  intendedRole,
  location = "hero_section",
  open: openProp,
  onOpenChange,
}: {
  children: React.ReactNode;
  referredBy?: string;
  intendedRole?: Role;
  location?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const submit = useServerFn(submitEarlyAccess);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const [role, setRole] = useState<Role | null>(intendedRole ?? null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ role?: string; email?: string; consent?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const emailId = useId();
  const consentId = useId();

  useEffect(() => {
    if (intendedRole) setRole(intendedRole);
  }, [intendedRole]);

  useEffect(() => {
    if (open) {
      trackAnalyticsEvent("waitlist_form_viewed", { location });
    }
  }, [open, location]);

  const selectRole = (next: Role) => {
    setRole(next);
    setErrors((e) => ({ ...e, role: undefined }));
    trackAnalyticsEvent("interest_selected", { role: next, location });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!role) next.role = "Choose Traveller or WayMaker to continue.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address.";
    if (!consent) next.consent = "Please tick this box to receive OwnWay updates.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await submit({
        data: {
          email: email.trim(),
          role: role as Role,
          source: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: getStoredReferralCode() ?? captureReferralCode(referredBy) ?? null,
          consent_marketing: true,
          consent_policy_version: CONSENT_POLICY_VERSION,
          consent_source: location,
        },
      });
      clearReferralCode();
      void trackPrelaunchEvent("email_signup", { metadata: { location } });
      trackAnalyticsEvent("waitlist_form_submitted", { location });
      setDone(true);
    } catch (err: any) {
      setErrors({ email: err?.message ?? "Could not sign you up. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setDone(false);
        setEmail("");
        setConsent(false);
        setErrors({});
      }, 220);
    }
  };

  return (
    <Dialog open={open} onOpenChange={reset}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[100dvh] max-w-none flex-col justify-center rounded-none border-0 bg-background px-6 py-10 sm:h-auto sm:max-w-md sm:rounded-3xl sm:border sm:px-8 sm:py-10">
        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Check className="h-6 w-6" />
            </div>
            <DialogTitle className="mt-6 font-display text-3xl text-ink">
              You're on the list.
            </DialogTitle>
            <DialogDescription className="mt-3 text-base text-muted-foreground">
              We'll be in touch when early access opens.
            </DialogDescription>
            <Button
              className="mt-8 h-12 w-full rounded-full"
              onClick={() => reset(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-7">
            <div className="space-y-3">
              <DialogTitle className="font-display text-3xl text-ink sm:text-4xl">
                Join OwnWay
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                Whether you want to discover a place more deeply or share the place you
                know best, you're in the right place.
              </DialogDescription>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground/80">I'm joining as</legend>
              <div
                role="radiogroup"
                aria-label="Join as"
                className="grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-card p-1"
              >
                {(
                  [
                    ["explorer", "Traveller"],
                    ["waymaker", "WayMaker"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={role === value}
                    onClick={() => selectRole(value)}
                    className={`h-11 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      role === value
                        ? "bg-ink text-background"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.role}
                </p>
              )}
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor={emailId}>Email address</Label>
              <Input
                id={emailId}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                }}
                aria-invalid={!!errors.email || undefined}
                aria-describedby={errors.email ? `${emailId}-error` : undefined}
                className="h-12 rounded-full px-5 text-base"
              />
              {errors.email && (
                <p id={`${emailId}-error`} role="alert" className="text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={consentId}
                  checked={consent}
                  onCheckedChange={(v) => {
                    setConsent(v === true);
                    if (v === true) setErrors((x) => ({ ...x, consent: undefined }));
                  }}
                  aria-invalid={!!errors.consent || undefined}
                  aria-describedby={errors.consent ? `${consentId}-error` : undefined}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={consentId}
                  className="cursor-pointer text-sm font-normal leading-relaxed text-foreground/85"
                >
                  I agree to receive OwnWay early-access and launch updates. I can
                  unsubscribe at any time.{" "}
                  <Link
                    to="/privacy"
                    className="text-accent underline-offset-2 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.consent && (
                <p id={`${consentId}-error`} role="alert" className="text-xs text-destructive">
                  {errors.consent}
                </p>
              )}
            </div>

            <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full text-base">
              {submitting ? "Saving…" : "Join early access"}
              {!submitting && <ArrowRight className="ml-1.5 size-4" />}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
