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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitTripRequest } from "@/lib/trip.functions";

export const Route = createFileRoute("/trip/new")({
  head: () => ({
    meta: [
      { title: "Plan your trip — OwnWay" },
      { name: "description", content: "Tell us what kind of experience you want to live. We'll match you with the right WayMaker." },
    ],
  }),
  component: TripNewPage,
});

const TRIP_DURATIONS = ["1 day", "2–3 days", "4–7 days", "1–2 weeks", "More than 2 weeks", "Not sure yet"];
const TRAVEL_GROUPS = ["Solo", "Couple", "Friends", "Family", "Work trip", "Other"];
const FIRST_TIME = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "different", label: "I've been there but want a different experience" },
];
const BUDGET = ["Low budget", "Smart value", "Comfortable", "Premium", "Mixed"];
const LANGS = ["English", "Italian", "German", "Spanish", "French", "Other"];
const INTERESTS = [
  "Food","Wine / drinks","Local neighborhoods","Art","Museums","History","Architecture",
  "Nature","Hiking","Sea / lakes","Nightlife","Music","Events","Shopping","Markets",
  "Sports","Wellness","Photography","Hidden gems","Local traditions","Budget-friendly places",
  "Romantic places","Family-friendly activities","Solo-friendly activities",
];

const SLIDERS = [
  { key: "authenticity_comfort_score", title: "Authenticity vs Comfort", lo: "I prefer comfort", hi: "I want very authentic/local" },
  { key: "slow_intense_score", title: "Slow vs Intense", lo: "Relaxed rhythm", hi: "See and do as much as possible" },
  { key: "famous_hidden_score", title: "Famous vs Hidden", lo: "The must-sees", hi: "Less obvious places" },
  { key: "planning_spontaneity_score", title: "Planning vs Spontaneity", lo: "Clear plan", hi: "Flexible suggestions" },
  { key: "movement_score", title: "Movement", lo: "Move as little as possible", hi: "Happy to move around" },
  { key: "queue_tolerance_score", title: "Queues", lo: "I hate queues", hi: "I'll wait for something special" },
] as const;

type FormState = {
  destination_city: string;
  destination_country: string;
  travel_start_date: string;
  travel_end_date: string;
  trip_duration: string;
  travel_group: string;
  first_time_destination: string;
  accommodation_area: string;
  already_planned_text: string;
  authenticity_comfort_score: number;
  slow_intense_score: number;
  famous_hidden_score: number;
  planning_spontaneity_score: number;
  movement_score: number;
  queue_tolerance_score: number;
  interests: string[];
  specific_request_text: string;
  budget_style: string;
  food_preferences: string;
  mobility_constraints: string;
  safety_concerns: string;
  preferred_languages: string[];
  first_name: string;
  email: string;
  consent_to_match: boolean;
};

const initial: FormState = {
  destination_city: "", destination_country: "", travel_start_date: "", travel_end_date: "",
  trip_duration: "", travel_group: "", first_time_destination: "", accommodation_area: "",
  already_planned_text: "",
  authenticity_comfort_score: 3, slow_intense_score: 3, famous_hidden_score: 3,
  planning_spontaneity_score: 3, movement_score: 3, queue_tolerance_score: 3,
  interests: [], specific_request_text: "", budget_style: "", food_preferences: "",
  mobility_constraints: "", safety_concerns: "", preferred_languages: [],
  first_name: "", email: "", consent_to_match: false,
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:border-foreground/50"}`}
    >
      {children}
    </button>
  );
}

function TripNewPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitTripRequest);
  const [f, setF] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const upd = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = <K extends "interests" | "preferred_languages">(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  const steps: WizardStep[] = [
    {
      title: "Where are you going?",
      subtitle: "Every trip is different. Tell us the basics.",
      validate: () => !f.destination_city ? "Please add a destination city" : !f.trip_duration ? "Please choose a duration" : null,
      render: () => (
        <>
          <div>
            <Label>Destination city *</Label>
            <Input className="mt-2" placeholder="Naples, Lisbon, Tokyo, Paris…" value={f.destination_city} onChange={(e) => upd("destination_city", e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Input className="mt-2" value={f.destination_country} onChange={(e) => upd("destination_country", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start date</Label>
              <Input type="date" className="mt-2" value={f.travel_start_date} onChange={(e) => upd("travel_start_date", e.target.value)} />
            </div>
            <div>
              <Label>End date</Label>
              <Input type="date" className="mt-2" value={f.travel_end_date} onChange={(e) => upd("travel_end_date", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Trip duration *</Label>
            <Select value={f.trip_duration} onValueChange={(v) => upd("trip_duration", v)}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Choose a duration" /></SelectTrigger>
              <SelectContent>{TRIP_DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </>
      ),
    },
    {
      title: "What kind of trip is this?",
      render: () => (
        <>
          <div>
            <Label>Who are you traveling with?</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRAVEL_GROUPS.map((g) => <Chip key={g} active={f.travel_group === g} onClick={() => upd("travel_group", g)}>{g}</Chip>)}
            </div>
          </div>
          <div>
            <Label>First time in this destination?</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {FIRST_TIME.map((g) => <Chip key={g.value} active={f.first_time_destination === g.value} onClick={() => upd("first_time_destination", g.value)}>{g.label}</Chip>)}
            </div>
          </div>
          <div>
            <Label>Where will you stay?</Label>
            <Input className="mt-2" placeholder="Neighborhood, hotel area, or approximate location" value={f.accommodation_area} onChange={(e) => upd("accommodation_area", e.target.value)} />
          </div>
          <div>
            <Label>What do you already know or have planned?</Label>
            <Textarea className="mt-2" rows={3} placeholder="I already booked a hotel near the center and want to avoid tourist traps…" value={f.already_planned_text} onChange={(e) => upd("already_planned_text", e.target.value)} />
          </div>
        </>
      ),
    },
    {
      title: "What experience do you want to live?",
      subtitle: "This is the most important step.",
      render: () => (
        <div className="space-y-7">
          {SLIDERS.map((s) => (
            <div key={s.key}>
              <div className="flex items-baseline justify-between">
                <Label className="text-sm">{s.title}</Label>
                <span className="text-xs text-muted-foreground">{f[s.key]} / 5</span>
              </div>
              <Slider min={1} max={5} step={1} value={[f[s.key]]} onValueChange={([v]) => upd(s.key, v)} className="mt-3" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{s.lo}</span><span>{s.hi}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "What matters most for this trip?",
      render: () => (
        <>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => <Chip key={i} active={f.interests.includes(i)} onClick={() => toggle("interests", i)}>{i}</Chip>)}
          </div>
          <div>
            <Label>Anything specific you're looking for?</Label>
            <Textarea className="mt-2" rows={3} placeholder="Great local food, relaxed neighborhoods, one special evening…" value={f.specific_request_text} onChange={(e) => upd("specific_request_text", e.target.value)} />
          </div>
        </>
      ),
    },
    {
      title: "What should your WayMaker know?",
      render: () => (
        <>
          <div>
            <Label>Budget style</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BUDGET.map((b) => <Chip key={b} active={f.budget_style === b} onClick={() => upd("budget_style", b)}>{b}</Chip>)}
            </div>
          </div>
          <div>
            <Label>Food preferences or restrictions</Label>
            <Textarea className="mt-2" rows={2} value={f.food_preferences} onChange={(e) => upd("food_preferences", e.target.value)} />
          </div>
          <div>
            <Label>Mobility constraints</Label>
            <Textarea className="mt-2" rows={2} placeholder="I don't want to walk too much / I will not rent a car." value={f.mobility_constraints} onChange={(e) => upd("mobility_constraints", e.target.value)} />
          </div>
          <div>
            <Label>Safety concerns</Label>
            <Textarea className="mt-2" rows={2} value={f.safety_concerns} onChange={(e) => upd("safety_concerns", e.target.value)} />
          </div>
          <div>
            <Label>Preferred languages</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {LANGS.map((l) => <Chip key={l} active={f.preferred_languages.includes(l)} onClick={() => toggle("preferred_languages", l)}>{l}</Chip>)}
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Where should we send your match?",
      validate: () => !f.email ? "Please enter your email" : !f.consent_to_match ? "Please accept the consent to continue" : null,
      render: () => (
        <>
          <div>
            <Label>First name</Label>
            <Input className="mt-2" value={f.first_name} onChange={(e) => upd("first_name", e.target.value)} />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" className="mt-2" value={f.email} onChange={(e) => upd("email", e.target.value)} />
          </div>
          <label className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
            <Checkbox checked={f.consent_to_match} onCheckedChange={(v) => upd("consent_to_match", Boolean(v))} className="mt-0.5" />
            <span className="text-sm">I agree that my trip profile can be used to manually match me with suitable WayMakers.</span>
          </label>
          <p className="text-xs text-muted-foreground">Your answers are private. They are used only to prepare your OwnWay match and will not be shared publicly without your permission.</p>
        </>
      ),
    },
  ];

  const onComplete = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...f,
        consent_to_match: true as const,
        travel_start_date: f.travel_start_date || null,
        travel_end_date: f.travel_end_date || null,
        destination_country: f.destination_country || null,
        travel_group: f.travel_group || null,
        first_time_destination: f.first_time_destination || null,
        accommodation_area: f.accommodation_area || null,
        already_planned_text: f.already_planned_text || null,
        specific_request_text: f.specific_request_text || null,
        budget_style: f.budget_style || null,
        food_preferences: f.food_preferences || null,
        mobility_constraints: f.mobility_constraints || null,
        safety_concerns: f.safety_concerns || null,
        first_name: f.first_name || null,
      };
      const res = await submit({ data: payload });
      navigate({ to: "/trip/confirmation/$token", params: { token: res.token } });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Plan your trip</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Tell us the experience you want to live.</h1>
        </div>
        <div className="mt-12">
          <StepWizard steps={steps} onComplete={onComplete} finalLabel="Create my trip profile" submitting={submitting} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
