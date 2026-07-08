import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitEarlyAccess } from "@/lib/early-access.functions";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

export function EmailCapture({
  referredBy,
  intendedRole,
  id,
  cta = "Get Early Access",
  location = "hero_section",
}: {
  referredBy?: string;
  intendedRole?: "explorer" | "waymaker";
  id?: string;
  cta?: string;
  location?: string;
}) {
  const submit = useServerFn(submitEarlyAccess);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"explorer" | "waymaker" | null>(intendedRole ?? null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (intendedRole) setRole(intendedRole);
  }, [intendedRole]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!role) return toast.error("Please choose Traveler or WayMaker");
    setSubmitting(true);
    try {
      const res = await submit({
        data: {
          email,
          role,
          source: typeof window !== "undefined" ? document.referrer || "direct" : "direct",
          referred_by: referredBy || null,
        },
      });
      void trackPrelaunchEvent("email_signup", {
        email,
        metadata: { role, already: res.already ?? false },
      });
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
    <form id={id} onSubmit={onSubmit} className="w-full space-y-3">
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
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-full px-6"
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
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mr-2">
          I want to join as
        </p>
        <div className="inline-flex rounded-full border border-border/70 bg-card p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setRole("explorer")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "explorer" ? "bg-ink text-background" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "explorer"}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("waymaker")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              role === "waymaker" ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground"
            }`}
            aria-pressed={role === "waymaker"}
          >
            WayMaker
          </button>
        </div>
      </div>
    </form>
  );
}
