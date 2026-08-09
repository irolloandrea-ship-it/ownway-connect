import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustrative example of the kind of advice a WayMaker could give.
 * Explicitly labelled as an example — not a review, testimonial or real interaction.
 */
export function ProofCard({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-card md:p-9",
        className,
      )}
    >
      <figcaption className="text-[11px] uppercase tracking-[0.22em] text-accent">
        An example of the kind of local advice you could receive
      </figcaption>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1.2fr] md:items-start md:gap-8">
        <p className="font-display text-2xl leading-snug text-ink md:text-[1.75rem]">
          “Where should I eat on a quiet Tuesday?”
        </p>

        <span
          aria-hidden
          className="hidden h-full w-px bg-border md:block"
        />

        <blockquote className="flex gap-3">
          <Quote className="mt-1 size-5 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
          <p className="text-base leading-relaxed text-muted-foreground">
            Try a small local trattoria after 8pm, when the neighbourhood comes alive.
          </p>
        </blockquote>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Illustrative example. OwnWay is in pre-launch, so this is not a real conversation,
        review or rating.
      </p>
    </figure>
  );
}
