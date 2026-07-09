import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — OwnWay" },
      {
        name: "description",
        content:
          "How OwnWay collects, uses, and protects your personal data, including your email address for early access updates.",
      },
      { property: "og:title", content: "Privacy Policy — OwnWay" },
      {
        property: "og:description",
        content:
          "How OwnWay collects, uses, and protects your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
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
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to OwnWay
          </Link>

          <header className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">
              Legal
            </p>
            <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: 09/07/2026
            </p>
            <p className="mt-4 text-muted-foreground">
              This Privacy Policy explains how OwnWay collects and processes
              personal data from users who enter their email address through the
              OwnWay website.
            </p>
            <p className="mt-4 text-muted-foreground">
              OwnWay is an early-stage travel platform designed to connect
              travelers with people who truly know a destination, so they can
              receive human, practical, and personalized travel advice.
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

          <Section n={2} title="Personal data we collect">
            <p>
              Through the forms available on the website, OwnWay collects the
              following personal data:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Email address</li>
            </ul>
            <p>
              In some cases, OwnWay may also collect anonymous or aggregated
              technical information about website usage, such as page visits or
              button interactions, if analytics tools are active.
            </p>
          </Section>

          <Section n={3} title="Why we collect your data">
            <p>We collect your email address for the following purposes:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>to add you to the OwnWay early access list or waitlist;</li>
              <li>to send you updates about the launch of OwnWay;</li>
              <li>
                to send invitations, news, or information about the availability
                of the platform;
              </li>
              <li>
                to contact you regarding your interest in OwnWay as a Traveler
                or WayMaker.
              </li>
            </ul>
            <p>
              Your email address will not be used for unrelated purposes without
              providing further information or, where required, asking for your
              consent.
            </p>
          </Section>

          <Section n={4} title="Legal basis for processing">
            <p>We process your email address based on your consent.</p>
            <p>
              You give this consent when you voluntarily enter your email
              address into a form and submit an early access or waitlist
              request.
            </p>
            <p>
              You can withdraw your consent at any time by contacting us at:{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
            </p>
            <p>
              Withdrawing consent does not affect the lawfulness of processing
              carried out before the withdrawal.
            </p>
          </Section>

          <Section n={5} title="How we process your data">
            <p>
              Your personal data is processed using digital tools and
              organizational measures appropriate to the purposes described in
              this Privacy Policy.
            </p>
            <p>
              OwnWay takes reasonable measures to protect personal data from
              unauthorized access, loss, misuse, alteration, or unauthorized
              disclosure.
            </p>
          </Section>

          <Section n={6} title="Data retention">
            <p>
              Your email address will be kept for as long as necessary to manage
              the early access list and communications related to the launch of
              OwnWay.
            </p>
            <p>
              You can request deletion of your email address at any time by
              contacting us at:{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
            </p>
            <p>
              When your personal data is no longer necessary for the purposes
              described above, it will be deleted or anonymized.
            </p>
          </Section>

          <Section n={7} title="Sharing data with third parties">
            <p>We do not sell your personal data to third parties.</p>
            <p>
              Your email address may be processed through technical service
              providers used to operate the website, manage the database, send
              emails, manage the waitlist, or analyze website performance.
            </p>
            <p>
              These providers may process your data only to the extent necessary
              to provide their services.
            </p>
          </Section>

          <Section n={8} title="International data transfers">
            <p>
              Some tools used to operate the website or manage email
              communications may process or store data outside the European
              Union.
            </p>
            <p>
              Where this happens, data transfers will be carried out in
              accordance with the safeguards required by applicable data
              protection laws.
            </p>
          </Section>

          <Section n={9} title="Your rights">
            <p>
              You may exercise your rights under applicable data protection laws
              at any time, including the right to:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>access your personal data;</li>
              <li>request correction of inaccurate data;</li>
              <li>request deletion of your data;</li>
              <li>request restriction of processing;</li>
              <li>object to processing, where applicable;</li>
              <li>withdraw consent;</li>
              <li>request data portability, where applicable;</li>
              <li>
                lodge a complaint with the competent data protection authority.
              </li>
            </ul>
            <p>
              To exercise your rights, you can contact us at:{" "}
              <a
                href="mailto:theownwayapp@gmail.com"
                className="text-accent hover:underline"
              >
                theownwayapp@gmail.com
              </a>
            </p>
          </Section>

          <Section n={10} title="Providing your data is optional">
            <p>Providing your email address is optional.</p>
            <p>
              However, if you do not provide your email address, you will not be
              able to join the OwnWay early access list or receive updates about
              the launch.
            </p>
          </Section>

          <Section n={11} title="Changes to this Privacy Policy">
            <p>
              OwnWay may update this Privacy Policy from time to time, including
              to reflect changes to the service or applicable legal
              requirements.
            </p>
            <p>
              The most recent version will always be available on the website.
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
