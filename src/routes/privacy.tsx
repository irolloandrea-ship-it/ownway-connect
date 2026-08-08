import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { openCookieSettings, getMeasurementId } from "@/lib/cookie-consent";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — OwnWay" },
      {
        name: "description",
        content:
          "How OwnWay collects, uses, and protects personal data, including waitlist emails and Google Analytics cookies.",
      },
      { property: "og:title", content: "Privacy Policy — OwnWay" },
      {
        property: "og:description",
        content:
          "How OwnWay collects, uses, and protects your personal data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — OwnWay" },
      {
        name: "twitter:description",
        content: "How OwnWay collects, uses, and protects your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

// Update this string whenever the policy substance changes so we can prove
// what a user agreed to at signup time. It is also written server-side into
// the consent record for every waitlist submission.
const POLICY_VERSION = "2026-07-26";
const LAST_UPDATED = "9 July 2026";

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

function PrivacyPage() {
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
            <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {LAST_UPDATED} · Version {POLICY_VERSION}
            </p>
            <p className="mt-4 text-muted-foreground">
              This Privacy Policy explains how OwnWay collects and processes
              personal data through this website. OwnWay is an early-stage
              travel platform; this landing page collects waitlist and
              early-access interest only. Account creation, matching, and
              in-app services will be introduced later with additional
              information.
            </p>
          </header>

          <Section n={1} title="Data Controller">
            <p>The Data Controller is:</p>
            <p>
              Andrea Irollo
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
              <a
                href="https://ownway.app"
                className="text-accent hover:underline"
              >
                https://ownway.app
              </a>
            </p>
          </Section>

          <Section n={2} title="Data we collect">
            <p>
              <strong>Data you provide through the waitlist form:</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>your email address;</li>
              <li>
                your selected interest as <em>Traveler</em> or <em>WayMaker</em>{" "}
                (if you choose one);
              </li>
              <li>the timestamp of your submission;</li>
              <li>
                a record of your marketing consent, including the exact policy
                version you agreed to and the form / page from which you
                submitted.
              </li>
            </ul>
            <p>
              <strong>Technical and security data:</strong> when you visit the
              website we may process a limited amount of technical information
              — such as your IP address, browser and device information, and
              form-submission signals — to operate the website, prevent spam,
              and secure it against misuse.
            </p>
          </Section>

          <Section n={3} title="Why we use your data">
            <ul className="list-disc space-y-1 pl-6">
              <li>to manage your early-access / waitlist request;</li>
              <li>
                to send launch updates, invitations, and information about the
                availability of OwnWay;
              </li>
              <li>
                to contact you about your stated Traveler or WayMaker interest;
              </li>
              <li>to manage unsubscribe requests;</li>
              <li>to prevent spam and misuse of the website.</li>
            </ul>
          </Section>

          <Section n={4} title="Legal basis">
            <p>
              We rely on your <strong>explicit consent</strong> for early-access
              and launch email communications. You give this consent by ticking
              the dedicated checkbox above the submit button when signing up.
            </p>
            <p>
              Security and anti-abuse processing may rely on our{" "}
              <strong>legitimate interest</strong> in keeping the website safe
              and functional.
            </p>
            <p>
              You can withdraw your consent at any time using the unsubscribe
              link in every OwnWay email, or by emailing{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
              . Withdrawing consent does not affect the lawfulness of
              processing carried out before the withdrawal.
            </p>
          </Section>

          <Section n={5} title="Retention">
            <p>
              We retain waitlist data until you withdraw your consent, or for
              up to <strong>24 months</strong> after sign-up if you have not
              interacted with an OwnWay communication in the meantime and no
              other lawful retention reason applies. After that, we delete or
              anonymise your data.
            </p>
            <p>
              If you unsubscribe, we may retain minimal information (for
              example a hashed record of your email address) for the sole
              purpose of honouring your opt-out.
            </p>
          </Section>

          <Section n={6} title="Service providers and recipients">
            <p>
              We do <strong>not sell</strong> your personal data. We share it
              only with service providers that help us operate the website and
              send communications, and only to the extent necessary for those
              services. Current or planned providers include:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Hosting and website delivery:</strong> Lovable and
                Cloudflare.
              </li>
              <li>
                <strong>Waitlist database and form storage:</strong> Supabase
                (managed via Lovable Cloud).
              </li>
              <li>
                <strong>Transactional email delivery:</strong> Mailgun (via the
                Lovable email infrastructure).
              </li>
              <li>
                <strong>Website analytics:</strong> Google Analytics 4 — only
                after you accept analytics cookies (see section 8).
              </li>
            </ul>
            <p>
              If we introduce an additional email marketing or newsletter
              provider, we will update this policy and its version before that
              provider processes any personal data.
            </p>

          </Section>

          <Section n={7} title="International transfers">
            <p>
              Some of the providers listed above may process data outside the
              European Economic Area (for example in the United States). Where
              this happens, we rely on the safeguards required by applicable
              data-protection law, such as the European Commission's Standard
              Contractual Clauses, together with any additional measures the
              provider offers.
            </p>
          </Section>

          <Section n={8} title="Cookies and Google Analytics" id="analytics">
            <p>
              OwnWay uses <strong>Google Analytics 4</strong> only to
              understand aggregate use of the website and improve it. When you
              accept analytics cookies, Google Analytics may process page
              visits, interactions, browser and device information, referrer
              information, technical identifiers or cookies, and approximate
              location derived from your IP address.
            </p>
            <p>
              We do <strong>not</strong> intentionally send email addresses,
              waitlist form content, or other directly identifying form data
              to Google Analytics.
            </p>
            <p>
              Google Analytics is loaded only after you accept analytics
              cookies. Until then, Google Consent Mode keeps analytics storage
              denied and no analytics cookies are set.
            </p>
            <p>
              For more information about how Google processes data on
              partner sites, see{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                policies.google.com/technologies/partner-sites
              </a>
              .
            </p>
            <p className="rounded-lg border border-dashed border-border/70 bg-card/50 p-4 text-sm text-muted-foreground">
              <strong>Google Analytics data retention:</strong> Event-level
              analytics data is retained for 2 months. Aggregate reports may
              be retained by Google for longer in accordance with Google’s
              applicable terms and settings.
            </p>
            {hasAnalytics && (
              <p>
                You can change your analytics choice at any time:{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-accent"
                  onClick={openCookieSettings}
                >
                  Open cookie settings
                </Button>
                .
              </p>
            )}
          </Section>

          <Section n={9} title="Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>access your personal data;</li>
              <li>request correction of inaccurate data;</li>
              <li>request deletion of your data;</li>
              <li>request restriction of processing;</li>
              <li>object to processing, where applicable;</li>
              <li>withdraw your consent at any time;</li>
              <li>request data portability, where applicable;</li>
              <li>lodge a complaint with a competent data-protection authority.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
              .
            </p>
            <p>
              If you are based in Italy, you may also file a complaint with the
              Italian Data Protection Authority (Garante per la protezione dei
              dati personali):{" "}
              <a
                href="https://www.garanteprivacy.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                www.garanteprivacy.it
              </a>
              .
            </p>
          </Section>

          <Section n={10} title="Providing your data is optional">
            <p>
              Providing your email address and marketing consent is optional.
              Without them we cannot add you to the waitlist or send you
              early-access updates, but you can continue to browse the public
              website.
            </p>
          </Section>

          <Section n={11} title="Changes to this Privacy Policy">
            <p>
              We may update this Privacy Policy over time — for example to
              reflect changes to the service, new service providers, or
              applicable legal requirements. When we do, we will update the
              effective date and version at the top of this page. The current
              version is always available on this website.
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
