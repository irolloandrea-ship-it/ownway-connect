import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/legal-notice")({
  head: () => ({
    meta: [
      { title: "Legal Notice — OwnWay" },
      {
        name: "description",
        content:
          "Legal notice and operator information for the OwnWay early-access website.",
      },
      { property: "og:title", content: "Legal Notice — OwnWay" },
      {
        property: "og:description",
        content: "Operator and contact information for the OwnWay website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Legal Notice — OwnWay" },
      {
        name: "twitter:description",
        content: "Operator and contact information for the OwnWay website.",
      },
    ],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-14 md:py-20">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to OwnWay
          </Link>

          <header className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Legal</p>
            <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">Legal Notice</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: 26 July 2026
            </p>
          </header>

          <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-foreground/85">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Operator</h2>
            <p>
              This website is operated by <strong>Andrea Irollo</strong>.
            </p>
            <p>
              Address: Via Rosso Fiorentino 118, 51100 Pistoia (PT), Italy
            </p>
            <p>
              Contact email:{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
              <br />
              Website:{" "}
              <a href="https://ownway.app" className="text-accent hover:underline">
                https://ownway.app
              </a>
            </p>
          </section>

          <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-foreground/85">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Purpose of this website</h2>
            <p>
              This landing page provides information about OwnWay and allows
              visitors to register their interest in early access. It does not
              currently offer account creation, bookings, payments, or in-app
              matching. Additional terms will be published before those
              features become available.
            </p>
          </section>

          <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-foreground/85">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Copyright</h2>
            <p>
              © {year} OwnWay. All rights reserved. The OwnWay name, logo, and
              website content are the property of Andrea Irollo unless
              otherwise indicated.
            </p>
          </section>

          <section className="mt-10 space-y-3 text-[15px] leading-relaxed text-foreground/85">
            <h2 className="font-display text-2xl text-ink md:text-3xl">Privacy</h2>
            <p>
              For information about how personal data is collected and
              processed, please see the{" "}
              <Link to="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <div className="mt-12 border-t border-border/60 pt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to OwnWay
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
