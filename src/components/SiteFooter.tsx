import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useIsAdmin } from "@/hooks/use-is-admin";

export function SiteFooter() {
  const isAdmin = useIsAdmin();
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <Logo size={28} tagline />
          <p className="max-w-sm text-sm text-muted-foreground">Travel your way.</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="mailto:hello@ownway.travel" className="hover:text-foreground">Contact</a>
          <Link to="/" hash="how-it-works" className="hover:text-foreground">How it works</Link>
          {isAdmin && (
            <Link to="/admin" className="text-gold hover:text-foreground">Admin</Link>
          )}
        </div>
      </div>
      <div className="container-page pb-8 text-xs text-muted-foreground/70">
        OwnWay is currently in pre-launch. We are building the first community of Travelers and WayMakers city by city. © {new Date().getFullYear()} OwnWay
      </div>
    </footer>
  );
}
