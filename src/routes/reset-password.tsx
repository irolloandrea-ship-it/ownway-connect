import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — OwnWay" },
      { name: "description", content: "Choose a new password for your OwnWay admin account." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Set a new password — OwnWay" },
      { property: "og:description", content: "Choose a new password for your OwnWay admin account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async () => {
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/admin" });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not update password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin access</p>
          <h1 className="mt-2 font-display text-3xl">Set a new password</h1>
          {!ready ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Open this page from the password reset link in your email. If you arrived here directly, request a new
              link from the sign-in page.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <Label>New password</Label>
                <Input className="mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label>Confirm password</Label>
                <Input className="mt-2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <Button disabled={busy} onClick={onSubmit} className="w-full rounded-full">
                {busy ? "…" : "Update password"}
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
