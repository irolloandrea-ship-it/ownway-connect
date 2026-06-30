import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <Logo size={28} tagline />
          <p className="max-w-sm text-sm text-muted-foreground">
            Not the most famous local. The right person for your trip.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Link to="/trip/new" className="hover:text-foreground">Find my WayMaker</Link>
          <Link to="/moments" className="hover:text-foreground">OwnWay Moments</Link>
          <Link to="/waymaker/apply" className="hover:text-foreground">Become a WayMaker</Link>
          <Link to="/auth" className="hover:text-foreground">Admin</Link>
        </div>
      </div>
      <div className="container-page pb-8 text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} OwnWay
      </div>
    </footer>
  );
}
