import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin sign in — OwnWay" }, { name: "robots", content: "noindex, nofollow" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ next: safeNext(s.next) }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const goNext = () => {
    if (next) window.location.href = next;
    else navigate({ to: "/admin" });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, next]);

  const onSubmit = async () => {
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("If that email has an account, a reset link is on its way");
        setMode("signin");
        return;
      }
      const redirectTo = window.location.origin + (next ?? "/admin");
      const fn = mode === "signin" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
      const { error } = await fn;
      if (error) throw error;
      toast.success(mode === "signin" ? "Welcome back" : "Account created — check your email if confirmation is required");
      goNext();
    } catch (e: any) { toast.error(e?.message ?? "Authentication failed"); }
    finally { setBusy(false); }
  };


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Admin access</p>
          <h1 className="mt-2 font-display text-3xl">{mode === "signin" ? "Sign in" : mode === "signup" ? "Create admin account" : "Reset password"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Enter your admin email and we'll send you a link to set a new password."
              : "For the OwnWay founder/admin. The first account to sign up automatically becomes admin."}
          </p>
          <div className="mt-6 space-y-4">
            <div><Label>Email</Label><Input className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
            {mode !== "forgot" && (
              <div><Label>Password</Label><Input className="mt-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" /></div>
            )}
            <Button disabled={busy} onClick={onSubmit} className="w-full rounded-full">{busy ? "…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Send reset link"}</Button>
            {mode === "signin" && (
              <button onClick={() => setMode("forgot")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                Forgot your password?
              </button>
            )}
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
