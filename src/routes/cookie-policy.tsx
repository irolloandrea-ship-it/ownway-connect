import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { openCookieSettings, getMeasurementId } from "@/lib/cookie-consent";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — OwnWay" },
      {
        name: "description",
        content:
          "Which cookies and similar technologies OwnWay uses, why, and how to accept, reject, or change your analytics preferences at any time.",
      },
      { property: "og:title", content: "Cookie Policy — OwnWay" },
      {
        property: "og:description",
        content:
          "Cookies and similar technologies used on OwnWay, and how to manage your analytics consent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Cookie Policy — OwnWay" },
      {
        name: "twitter:description",
        content:
          "Cookies and similar technologies used on OwnWay, and how to manage your analytics consent.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

const LAST_UPDATED = "09/08/2026";

function Section({
  n,
  title,
  children,
  id,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="font-display text-2xl text-ink md:text-3xl">
        {n}. {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/85">
        {children}
      </div>
    </section>
  );
}

function CookiePolicyPage() {
  const hasAnalytics = getMeasurementId() !== null;

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
            <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">Cookie Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <Section n={1} title="Who we are">
            <p>
              Data Controller: <strong>Andrea Irollo</strong>
              <br />
              Address: Via Rosso Fiorentino 118, 51100 Pistoia (PT), Italy
              <br />
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
            <p>
              This policy explains the cookies and similar technologies (such as
              browser local storage) actually used on this website. For how we
              handle personal data more generally, see the{" "}
              <Link to="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section n={2} title="Strictly necessary technologies">
            <p>
              These are always active because the website cannot work properly
              without them. They are used only for:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>website and form security (protecting submissions from abuse);</li>
              <li>
                storing your cookie choice, so we remember whether you accepted or
                rejected analytics;
              </li>
              <li>
                processing form submissions, such as joining the early-access
                waitlist.
              </li>
            </ul>
            <p>
              Your cookie choice is saved in your browser&rsquo;s local storage
              together with the date of your decision and the policy version.
              These technologies do not track you across other websites.
            </p>
          </Section>

          <Section n={3} title="Optional analytics: Google Analytics 4" id="analytics">
            <p>
              With your explicit consent, we use Google Analytics 4 (GA4),
              provided by Google, to measure how the website is used in
              aggregate: for example how many people visit a page, which pages
              are viewed, and whether the waitlist form was viewed or submitted.
            </p>
            <p>
              GA4 sets cookies (such as <code>_ga</code> and <code>_ga_*</code>)
              and may store an identifier in your browser. IP anonymisation is
              enabled.
            </p>
            <p>
              <strong>
                Form values, email addresses, referral codes, user identifiers and
                other personal form data are never sent to Google Analytics.
              </strong>{" "}
              We only send page paths and simple, non-identifying event names.
            </p>
          </Section>

          <Section n={4} title="Consent: analytics only after you allow it">
            <p>
              Analytics is off by default. No Google Analytics script is loaded,
              no analytics cookie is set and no tracking event is sent before you
              actively enable Analytics and save your choice.
            </p>
            <p>
              On your first visit a cookie banner lets you accept analytics,
              reject it, or open the preferences panel. Rejecting, or closing the
              panel without saving, keeps analytics disabled.
            </p>
          </Section>

          <Section n={5} title="Changing or withdrawing your choice">
            <p>
              You can change or withdraw your analytics consent at any time using
              the &ldquo;Cookie settings&rdquo; link in the website footer. When
              you withdraw consent, we stop sending data to Google Analytics and
              delete the GA cookies we can reach from this site. You can also
              delete cookies through your browser settings.
            </p>
            {hasAnalytics && (
              <p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 rounded-full"
                  onClick={openCookieSettings}
                >
                  Open cookie preferences
                </Button>
              </p>
            )}
          </Section>

          <Section n={6} title="More information">
            <p>
              For details about the personal data we collect, how long we keep it
              and your rights, please read the{" "}
              <Link to="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              . You can also review our{" "}
              <Link to="/legal-notice" className="text-accent hover:underline">
                Legal Notice
              </Link>
              , or contact us at{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
              .
            </p>
          </Section>

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
