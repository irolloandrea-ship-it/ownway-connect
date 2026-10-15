import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { JoinEarlyAccess } from "@/components/JoinEarlyAccess";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

type Locale = "it" | "en";

const COPY = {
  en: {
    language: "Language",
    cta: "Try it free!",
  },
  it: {
    language: "Lingua",
    cta: "Provala gratis!",
  },
} as const;

function LanguageSwitch({ locale, onChange, compact = false }: { locale: Locale; onChange: (locale: Locale) => void; compact?: boolean }) {
  return (
    <div
      role="group"
      aria-label={COPY[locale].language}
      className={`inline-flex items-center rounded-full border border-border bg-card p-1 ${compact ? "self-start" : ""}`}
    >
      {(["it", "en"] as const).map((option) => (
        <Button
          key={option}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(option)}
          aria-pressed={locale === option}
          className={`h-7 rounded-full px-2.5 text-[11px] ${locale === option ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground"}`}
        >
          {option.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function SiteHeader({ locale = "en", onLocaleChange }: { locale?: Locale; onLocaleChange?: (locale: Locale) => void }) {
  const copy = COPY[locale];

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center" aria-label="OwnWay — Home">
          <Logo size={32} />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {onLocaleChange && <LanguageSwitch locale={locale} onChange={onLocaleChange} />}
          <JoinEarlyAccess locale={locale} location="header">
            <Button
              size="sm"
              className="h-9 rounded-full px-4 text-sm md:h-10 md:px-5"
              onClick={() =>
                trackPrelaunchEvent("cta_click", {
                  button_text: copy.cta,
                  button_location: "header",
                })
              }
            >
              {copy.cta}
            </Button>
          </JoinEarlyAccess>
        </div>
      </div>
    </header>
  );
}
