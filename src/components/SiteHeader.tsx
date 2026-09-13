import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

const NAV: { to: "/" | "/find-a-waymaker" | "/become-a-waymaker"; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/find-a-waymaker", label: "Find a WayMaker" },
  { to: "/become-a-waymaker", label: "Become a WayMaker" },
];

type Locale = "it" | "en";

const COPY = {
  en: {
    nav: ["Home", "Find a WayMaker", "Become a WayMaker"],
    menu: "Menu",
    openMenu: "Open menu",
    language: "Language",
  },
  it: {
    nav: ["Home", "Trova un WayMaker", "Diventa WayMaker"],
    menu: "Menu",
    openMenu: "Apri il menu",
    language: "Lingua",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = COPY[locale];

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-foreground"
              {...(item.exact ? { activeOptions: { exact: true } } : {})}
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {copy.nav[index]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {onLocaleChange && <LanguageSwitch locale={locale} onChange={onLocaleChange} />}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {onLocaleChange && <LanguageSwitch locale={locale} onChange={onLocaleChange} compact />}
        </div>

        {/* Mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={copy.openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand/50 md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-xs bg-background">
            <SheetTitle className="font-display text-2xl text-ink">{copy.menu}</SheetTitle>
            {onLocaleChange && (
              <div className="mt-5">
                <LanguageSwitch locale={locale} onChange={onLocaleChange} compact />
              </div>
            )}
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base text-foreground/80 transition-colors hover:bg-sand/50"
                  {...(item.exact ? { activeOptions: { exact: true } } : {})}
                  activeProps={{ className: "bg-sand/60 text-ink font-medium" }}
                >
                  {copy.nav[index]}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
