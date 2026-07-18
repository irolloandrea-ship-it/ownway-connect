import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { trackPrelaunchEvent } from "@/lib/prelaunch-analytics";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size={32} />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link
            to="/"
            className="hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Home
          </Link>
          <Link
            to="/find-a-waymaker"
            className="hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Find a WayMaker
          </Link>
          <Link
            to="/become-a-waymaker"
            className="hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Become a WayMaker
          </Link>
        </nav>
        <Link
          to="/"
          hash="join"
          onClick={() =>
            trackPrelaunchEvent("cta_click", {
              button_text: "Get early access",
              button_location: "navbar",
            })
          }
        >
          <Button size="sm" className="rounded-full">Get early access</Button>
        </Link>
      </div>
    </header>
  );
}
