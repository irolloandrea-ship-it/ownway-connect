import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { openCookieSettings, getMeasurementId } from "@/lib/cookie-consent";

export function SiteFooter() {
  const isAdmin = useIsAdmin();
  const hasAnalytics = getMeasurementId() !== null;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <Logo size={28} tagline />
          <p className="max-w-sm text-sm text-muted-foreground">Travel your way.</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">Contact</a>
          <Link to="/" hash="how-it-works" className="hover:text-foreground">How it works</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/legal-notice" className="hover:text-foreground">Legal Notice</Link>
          {hasAnalytics && (
            <button
              type="button"
              onClick={openCookieSettings}
              className="hover:text-foreground"
            >
              Cookie settings
            </button>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-gold hover:text-foreground">Admin</Link>
          )}
        </div>
      </div>
      <div className="container-page pb-8 text-xs leading-relaxed text-muted-foreground/80">
        <p>
          © {year} OwnWay. All rights reserved.
          <span className="mx-2 text-muted-foreground/50">·</span>
          Operated by Andrea Irollo
          <span className="mx-2 text-muted-foreground/50">·</span>
          Contact:{" "}
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">
            theownwayapp@gmail.com
          </a>
        </p>
        <p className="mt-2 text-muted-foreground/60">
          OwnWay is currently in pre-launch. We are building the first community of Travelers and WayMakers city by city.
        </p>
      </div>
    </footer>
  );
}
