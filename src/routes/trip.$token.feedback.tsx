import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitFeedback } from "@/lib/feedback.functions";

export const Route = createFileRoute("/trip/$token/feedback")({
  head: () => ({ meta: [{ title: "How was your OwnWay match?" }] }),
  component: FeedbackPage,
});

function ScoreSlider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label className="text-sm">{label}</Label>
        <span className="text-xs text-muted-foreground">{value} / 5</span>
      </div>
      <Slider min={1} max={5} step={1} value={[value]} onValueChange={([v]) => onChange(v)} className="mt-2" />
    </div>
  );
}

function FeedbackPage() {
  const { token } = useParams({ from: "/trip/$token/feedback" });
  const submit = useServerFn(submitFeedback);
  const navigate = useNavigate();
  const [s, setS] = useState({
    internal_match_score: 4, internal_match_feedback: "",
    understanding_score: 4, advice_quality_score: 4, accuracy_score: 4, usefulness_score: 4, overall_experience_score: 4,
    most_useful_text: "", improvement_text: "", public_review_permission: false,
  });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container-page py-24 text-center">
          <h1 className="text-4xl md:text-5xl">Thank you.</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Your feedback helps OwnWay become more personal, trustworthy, and useful.</p>
          <div className="mt-8"><Button onClick={() => navigate({ to: "/" })} className="rounded-full">Back to home</Button></div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const onSubmit = async () => {
    setBusy(true);
    try {
      await submit({ data: { token, ...s, internal_match_feedback: s.internal_match_feedback || null, most_useful_text: s.most_useful_text || null, improvement_text: s.improvement_text || null } });
      setDone(true);
    } catch (e: any) { toast.error(e?.message ?? "Could not submit"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-12">
        <div className="mx-auto max-w-2xl space-y-10">
          <header>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">Feedback</p>
            <h1 className="mt-2 text-4xl md:text-5xl">How was your OwnWay match?</h1>
          </header>

          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="text-2xl">MatchScore — internal</h2>
            <p className="mt-2 text-sm text-muted-foreground">This helps OwnWay improve the matching system. It does not affect the WayMaker's reputation.</p>
            <div className="mt-6 space-y-5">
              <ScoreSlider label="How well did this WayMaker fit your trip profile?" value={s.internal_match_score} onChange={(v) => setS({ ...s, internal_match_score: v })} />
              <div>
                <Label>Why was or wasn't this person a good match?</Label>
                <Textarea className="mt-2" rows={3} value={s.internal_match_feedback} onChange={(e) => setS({ ...s, internal_match_feedback: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <h2 className="text-2xl">WayScore — quality of help</h2>
            <p className="mt-2 text-sm text-muted-foreground">This evaluates the quality of the WayMaker's help.</p>
            <div className="mt-6 space-y-5">
              <ScoreSlider label="Understanding of your needs" value={s.understanding_score} onChange={(v) => setS({ ...s, understanding_score: v })} />
              <ScoreSlider label="Quality of advice" value={s.advice_quality_score} onChange={(v) => setS({ ...s, advice_quality_score: v })} />
              <ScoreSlider label="Accuracy of information" value={s.accuracy_score} onChange={(v) => setS({ ...s, accuracy_score: v })} />
              <ScoreSlider label="Usefulness in the real trip" value={s.usefulness_score} onChange={(v) => setS({ ...s, usefulness_score: v })} />
              <ScoreSlider label="Overall experience" value={s.overall_experience_score} onChange={(v) => setS({ ...s, overall_experience_score: v })} />
              <div>
                <Label>What was most useful?</Label>
                <Textarea className="mt-2" rows={3} value={s.most_useful_text} onChange={(e) => setS({ ...s, most_useful_text: e.target.value })} />
              </div>
              <div>
                <Label>What could have been better?</Label>
                <Textarea className="mt-2" rows={3} value={s.improvement_text} onChange={(e) => setS({ ...s, improvement_text: e.target.value })} />
              </div>
              <label className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
                <Checkbox checked={s.public_review_permission} onCheckedChange={(v) => setS({ ...s, public_review_permission: Boolean(v) })} className="mt-0.5" />
                <span className="text-sm">I allow OwnWay to show part of this review publicly.</span>
              </label>
            </div>
          </section>

          <Button disabled={busy} onClick={onSubmit} size="lg" className="w-full rounded-full">
            {busy ? "Sending…" : "Submit feedback"}
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
