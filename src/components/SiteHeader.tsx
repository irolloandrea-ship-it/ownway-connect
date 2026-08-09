import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/find-a-waymaker", label: "Find a WayMaker" },
  { to: "/become-a-waymaker", label: "Become a WayMaker" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-foreground"
              {...(item.exact ? { activeOptions: { exact: true } } : {})}
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          hash="join"
          className="hidden md:block"
          onClick={() =>
            trackPrelaunchEvent("cta_click", {
              button_text: "Get early access",
              button_location: "navbar",
            })
          }
        >
          <Button size="sm" className="rounded-full">Get early access</Button>
        </Link>

        {/* Mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand/50 md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-xs bg-background">
            <SheetTitle className="font-display text-2xl text-ink">Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base text-foreground/80 transition-colors hover:bg-sand/50"
                  {...(item.exact ? { activeOptions: { exact: true } } : {})}
                  activeProps={{ className: "bg-sand/60 text-ink font-medium" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              to="/"
              hash="join"
              className="mt-6 block"
              onClick={() => {
                setMenuOpen(false);
                trackPrelaunchEvent("cta_click", {
                  button_text: "Join early access",
                  button_location: "mobile_menu",
                });
              }}
            >
              <Button className="h-12 w-full rounded-full text-base">Join early access</Button>
            </Link>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
