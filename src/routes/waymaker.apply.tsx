import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StepWizard, type WizardStep } from "@/components/StepWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { submitWaymakerApplication } from "@/lib/waymaker.functions";

export const Route = createFileRoute("/waymaker/apply")({
  head: () => ({
    meta: [
      { title: "Become a WayMaker — OwnWay" },
      { name: "description", content: "Help travelers experience places in a way that actually fits them." },
    ],
  }),
  component: WaymakerApply,
});

const LANGS = ["English", "Italian", "German", "Spanish", "French", "Other"];
const RELATIONSHIP = [
  { v: "live_there", l: "I live there" },
  { v: "used_to_live_there", l: "I used to live there" },
  { v: "visit_often", l: "I visit often" },
  { v: "studied_there", l: "I studied there" },
  { v: "worked_there", l: "I worked there" },
  { v: "know_as_traveler", l: "I know it well as a traveler" },
  { v: "other", l: "Other" },
];
const STYLES = [
  "food-focused","culture-focused","nightlife-focused","budget travelers","premium travelers",
  "slow travelers","intense itinerary travelers","hidden gems seekers","first-time visitors",
  "solo travelers","couples","friend groups","families","nature lovers","art lovers",
  "local events seekers","safety-conscious travelers",
];
const HELP_METHODS = ["Text advice", "Short call", "In-person meeting if available", "City feed contributions", "All of the above"];
const AVAIL = ["Occasionally", "A few times per month", "Weekly", "Flexible"];
const CONTACT = ["Email", "WhatsApp", "Telegram", "In-app later"];

type Dest = { city: string; country: string; relationship_to_destination: string; confidence_level: number };
type State = {
  first_name: string; email: string; main_location: string;
  languages: string[]; destinations: Dest[];
  travel_style_tags: string[]; travel_style_description: string;
  preferred_help_methods: string[]; availability: string; preferred_contact_method: string;
  motivation_text: string; useful_advice_text: string;
  instagram_url: string; linkedin_url: string; blog_url: string; google_maps_url: string; other_url: string;
  consent_to_profile_review: boolean;
};

const init: State = {
  first_name: "", email: "", main_location: "",
  languages: [], destinations: [{ city: "", country: "", relationship_to_destination: "live_there", confidence_level: 4 }],
  travel_style_tags: [], travel_style_description: "",
  preferred_help_methods: [], availability: "", preferred_contact_method: "",
  motivation_text: "", useful_advice_text: "",
  instagram_url: "", linkedin_url: "", blog_url: "", google_maps_url: "", other_url: "",
  consent_to_profile_review: false,
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:border-foreground/50"}`}>{children}</button>;
}

function WaymakerApply() {
  const navigate = useNavigate();
  const submit = useServerFn(submitWaymakerApplication);
  const [f, setF] = useState<State>(init);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const upd = <K extends keyof State>(k: K, v: State[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = <K extends "languages" | "travel_style_tags" | "preferred_help_methods">(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const updDest = (i: number, patch: Partial<Dest>) =>
    setF((p) => ({ ...p, destinations: p.destinations.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) }));

  const steps: WizardStep[] = [
    {
      label: "Basic Information",
      title: "About you",
      validate: () => !f.first_name ? "Add your first name" : !f.email ? "Add your email" : !f.main_location ? "Add your main location" : f.languages.length === 0 ? "Pick at least one language" : null,
      render: () => (
        <>
          <div><Label>First name *</Label><Input className="mt-2" value={f.first_name} onChange={(e) => upd("first_name", e.target.value)} /></div>
          <div><Label>Email *</Label><Input type="email" className="mt-2" value={f.email} onChange={(e) => upd("email", e.target.value)} /></div>
          <div><Label>Main location *</Label><Input className="mt-2" value={f.main_location} onChange={(e) => upd("main_location", e.target.value)} /></div>
          <div>
            <Label>Languages spoken *</Label>
            <div className="mt-2 flex flex-wrap gap-2">{LANGS.map((l) => <Chip key={l} active={f.languages.includes(l)} onClick={() => toggle("languages", l)}>{l}</Chip>)}</div>
          </div>
        </>
      ),
    },
    {
      label: "Destinations Known",
      title: "Which places can you help with?",
      validate: () => f.destinations.some((d) => !d.city) ? "Add a city for every destination" : null,
      render: () => (
        <>
          {f.destinations.map((d, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Destination {i + 1}</p>
                {f.destinations.length > 1 && (
                  <button onClick={() => setF((p) => ({ ...p, destinations: p.destinations.filter((_, idx) => idx !== i) }))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div><Label>City *</Label><Input className="mt-1" value={d.city} onChange={(e) => updDest(i, { city: e.target.value })} /></div>
                <div><Label>Country</Label><Input className="mt-1" value={d.country} onChange={(e) => updDest(i, { country: e.target.value })} /></div>
              </div>
              <div className="mt-3">
                <Label>Relationship</Label>
                <Select value={d.relationship_to_destination} onValueChange={(v) => updDest(i, { relationship_to_destination: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{RELATIONSHIP.map((r) => <SelectItem key={r.v} value={r.v}>{r.l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="mt-3">
                <div className="flex justify-between"><Label>Confidence</Label><span className="text-xs text-muted-foreground">{d.confidence_level} / 5</span></div>
                <Slider className="mt-2" min={1} max={5} step={1} value={[d.confidence_level]} onValueChange={([v]) => updDest(i, { confidence_level: v })} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" className="rounded-full" onClick={() => setF((p) => ({ ...p, destinations: [...p.destinations, { city: "", country: "", relationship_to_destination: "live_there", confidence_level: 4 }] }))}>
            <Plus className="mr-1.5 size-4" /> Add destination
          </Button>
        </>
      ),
    },
    {
      label: "Travel Style",
      title: "What kind of traveler do you understand best?",
      render: () => (
        <>
          <div className="flex flex-wrap gap-2">{STYLES.map((s) => <Chip key={s} active={f.travel_style_tags.includes(s)} onClick={() => toggle("travel_style_tags", s)}>{s}</Chip>)}</div>
          <div>
            <Label>Describe your travel style in your own words</Label>
            <Textarea className="mt-2" rows={4} placeholder="I love helping people discover authentic food places, walkable neighborhoods, and experiences that feel local but still comfortable." value={f.travel_style_description} onChange={(e) => upd("travel_style_description", e.target.value)} />
          </div>
        </>
      ),
    },
    {
      label: "Availability",
      title: "How would you like to help?",
      render: () => (
        <>
          <div>
            <Label>Help methods</Label>
            <div className="mt-2 flex flex-wrap gap-2">{HELP_METHODS.map((m) => <Chip key={m} active={f.preferred_help_methods.includes(m)} onClick={() => toggle("preferred_help_methods", m)}>{m}</Chip>)}</div>
          </div>
          <div>
            <Label>Availability</Label>
            <Select value={f.availability} onValueChange={(v) => upd("availability", v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Choose availability" /></SelectTrigger>
              <SelectContent>{AVAIL.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred contact method</Label>
            <Select value={f.preferred_contact_method} onValueChange={(v) => upd("preferred_contact_method", v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Choose…" /></SelectTrigger>
              <SelectContent>{CONTACT.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </>
      ),
    },
    {
      label: "Trust & Quality",
      title: "Trust & quality",
      validate: () => !f.motivation_text ? "Tell us why you want to help" : !f.useful_advice_text ? "Tell us what makes your advice useful" : !f.consent_to_profile_review ? "Please accept the consent" : null,
      render: () => (
        <>
          <div><Label>Why do you want to become a WayMaker? *</Label><Textarea className="mt-2" rows={3} value={f.motivation_text} onChange={(e) => upd("motivation_text", e.target.value)} /></div>
          <div><Label>What makes your advice useful? *</Label><Textarea className="mt-2" rows={3} value={f.useful_advice_text} onChange={(e) => upd("useful_advice_text", e.target.value)} /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Instagram</Label><Input className="mt-1" value={f.instagram_url} onChange={(e) => upd("instagram_url", e.target.value)} /></div>
            <div><Label>LinkedIn</Label><Input className="mt-1" value={f.linkedin_url} onChange={(e) => upd("linkedin_url", e.target.value)} /></div>
            <div><Label>Blog</Label><Input className="mt-1" value={f.blog_url} onChange={(e) => upd("blog_url", e.target.value)} /></div>
            <div><Label>Google Maps list</Label><Input className="mt-1" value={f.google_maps_url} onChange={(e) => upd("google_maps_url", e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Other</Label><Input className="mt-1" value={f.other_url} onChange={(e) => upd("other_url", e.target.value)} /></div>
          </div>
          <label className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
            <Checkbox checked={f.consent_to_profile_review} onCheckedChange={(v) => upd("consent_to_profile_review", Boolean(v))} className="mt-0.5" />
            <span className="text-sm">I agree that my WayMaker profile can be reviewed and, if approved, shown to Explorers.</span>
          </label>
        </>
      ),
    },
  ];

  const onComplete = async () => {
    setBusy(true);
    try {
      await submit({ data: { ...f, consent_to_profile_review: true as const } });
      setDone(true);
    } catch (e: any) { toast.error(e?.message ?? "Could not submit"); }
    finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container-page py-24 text-center">
          <h1 className="text-4xl md:text-5xl">Your WayMaker application has been received</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">We'll review your profile and contact you when your WayMaker profile is ready.</p>
          <div className="mt-8"><Button onClick={() => navigate({ to: "/" })} className="rounded-full">Back to home</Button></div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Become a WayMaker</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Help travelers experience places in a way that actually fits them.</h1>
        </div>
        <div className="mt-12">
          <StepWizard steps={steps} onComplete={onComplete} finalLabel="Apply as WayMaker" submitting={busy} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
