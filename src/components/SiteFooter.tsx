import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useIsAdmin } from "@/hooks/use-is-admin";
export function SiteFooter({ locale = "en" }: { locale?: "it" | "en" }) {
  const isAdmin = useIsAdmin();
  const year = new Date().getFullYear();
  const it = locale === "it";

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <Logo size={28} tagline={it ? "viaggia a modo tuo" : true} />
          <p className="max-w-sm text-sm text-muted-foreground">{it ? "Viaggia a modo tuo." : "Travel your way."}</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">{it ? "Contatti" : "Contact"}</a>
          <Link to="/" hash="how-it-works" className="hover:text-foreground">{it ? "Come funziona" : "How it works"}</Link>
          <a href="https://www.iubenda.com/privacy-policy/30604389" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Privacy Policy</a>
          <Link to="/legal-notice" className="hover:text-foreground">{it ? "Note legali" : "Legal Notice"}</Link>
          <a href="https://www.iubenda.com/privacy-policy/30604389/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Cookie Policy</a>
          <a
            href="https://www.iubenda.com/privacy-policy/30604389/cookie-policy"
            className="iubenda-cs-preferences-link hover:text-foreground"
          >
            {it ? "Impostazioni cookie" : "Cookie settings"}
          </a>
          {isAdmin && (
            <Link to="/admin" className="text-gold hover:text-foreground">Admin</Link>
          )}
        </div>
      </div>
      <div className="container-page pb-8 text-xs leading-relaxed text-muted-foreground/80">
        <p>
          © {year} OwnWay. {it ? "Tutti i diritti riservati." : "All rights reserved."}
          <span className="mx-2 text-muted-foreground/50">·</span>
           {it ? "Contatti:" : "Contact:"}{" "}
          <a href="mailto:theownwayapp@gmail.com" className="hover:text-foreground">
            theownwayapp@gmail.com
          </a>
        </p>
        <p className="mt-2 text-muted-foreground/60">
          {it
            ? "OwnWay è attualmente in fase di pre-lancio. Stiamo costruendo la prima community di viaggiatori e WayMaker, città dopo città."
            : "OwnWay is currently in pre-launch. We are building the first community of Travelers and WayMakers city by city."}
        </p>
      </div>
    </footer>
  );
}
