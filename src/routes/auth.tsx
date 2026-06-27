import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin sign in — OwnWay" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async () => {
    setBusy(true);
    try {
      const fn = mode === "signin" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      const { error } = await fn;
      if (error) throw error;
      toast.success(mode === "signin" ? "Welcome back" : "Account created — check your email if confirmation is required");
      navigate({ to: "/admin" });
    } catch (e: any) { toast.error(e?.message ?? "Authentication failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin access</p>
          <h1 className="mt-2 font-display text-3xl">{mode === "signin" ? "Sign in" : "Create admin account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">For the OwnWay founder/admin. The first account to sign up automatically becomes admin.</p>
          <div className="mt-6 space-y-4">
            <div><Label>Email</Label><Input className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
            <div><Label>Password</Label><Input className="mt-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" /></div>
            <Button disabled={busy} onClick={onSubmit} className="w-full rounded-full">{busy ? "…" : mode === "signin" ? "Sign in" : "Sign up"}</Button>
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              {mode === "signin" ? "No account yet? Sign up" : "Have an account? Sign in"}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
