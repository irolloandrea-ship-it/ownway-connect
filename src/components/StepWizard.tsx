import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type WizardStep = {
  label?: string;
  title: string;
  subtitle?: string;
  render: () => ReactNode;
  validate?: () => string | null;
};

type Props = {
  steps: WizardStep[];
  onComplete: () => void | Promise<void>;
  finalLabel?: string;
  submitting?: boolean;
};

export function StepWizard({ steps, onComplete, finalLabel = "Submit", submitting }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const goNext = async () => {
    const err = step.validate?.();
    if (err) { setError(err); return; }
    setError(null);
    if (isLast) { await onComplete(); return; }
    setDirection(1);
    setIndex((i) => i + 1);
  };
  const goBack = () => {
    setError(null);
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Step {index + 1} of {steps.length}</span>
          {step.label && <span className="text-gold">{step.label}</span>}
        </div>
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <div key={i} className="group flex-1" title={s.label ?? s.title}>
              <span
                className={`block h-1 rounded-full transition-colors ${
                  i < index ? "bg-gold/60" : i === index ? "bg-gold" : "bg-border"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 hidden flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground md:flex">
          {steps.map((s, i) => (
            <span
              key={i}
              className={
                i === index
                  ? "text-foreground font-medium"
                  : i < index
                    ? "text-muted-foreground/80"
                    : "text-muted-foreground/50"
              }
            >
              {i + 1}. {s.label ?? s.title}
            </span>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 md:p-10"
          >
            <h2 className="text-3xl md:text-4xl">{step.title}</h2>
            {step.subtitle && (
              <p className="mt-2 text-muted-foreground">{step.subtitle}</p>
            )}
            <div className="mt-8 space-y-6">{step.render()}</div>
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={index === 0 || submitting}>
          <ArrowLeft className="mr-1.5 size-4" /> Back
        </Button>
        <Button onClick={goNext} disabled={submitting} className="rounded-full px-6">
          {isLast ? (submitting ? "Sending…" : finalLabel) : (<>Continue <ArrowRight className="ml-1.5 size-4" /></>)}
        </Button>
      </div>
    </div>
  );
}
