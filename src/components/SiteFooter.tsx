import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useIsAdmin } from "@/hooks/use-is-admin";
export function SiteFooter({ locale = "en" }: { locale?: "it" | "en" }) {
  const isAdmin = useIsAdmin();
  const year = new Date().getFullYear();
  const it = locale === "it";

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-page flex flex-col items-start justify-between gap-4 py-8 md:flex-row md:items-center">
        <Logo size={28} tagline={false} />
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">{it ? "Contatti" : "Contact"}</a>
          <a href="https://www.iubenda.com/privacy-policy/90957829" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Privacy Policy</a>
          <Link to="/legal-notice" className="hover:text-foreground">{it ? "Note legali" : "Legal Notice"}</Link>
          <a href="https://www.iubenda.com/privacy-policy/90957829/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Cookie Policy</a>
          {isAdmin && (
            <Link to="/admin" className="text-gold hover:text-foreground">Admin</Link>
          )}
        </div>
      </div>
      <div className="container-page pb-6 text-xs leading-relaxed text-muted-foreground/80">
        <p>
          © {year} OwnWay. {it ? "Tutti i diritti riservati." : "All rights reserved."}
          <span className="mx-2 text-muted-foreground/50">·</span>
           {it ? "Contatti:" : "Contact:"}{" "}
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">
            theownwayapp@gmail.com
          </a>
        </p>
        <p className="mt-1 text-muted-foreground/60">
          {it
            ? "OwnWay è attualmente in fase di pre-lancio. Stiamo costruendo la prima community di viaggiatori e WayMaker, città dopo città."
            : "OwnWay is currently in pre-launch. We are building the first community of Travelers and WayMakers city by city."}
        </p>
      </div>
    </footer>
  );
}
