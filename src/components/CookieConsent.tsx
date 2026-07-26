import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CONSENT_EVENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  applyConsent,
  getMeasurementId,
  readConsent,
  setConsent,
  type StoredConsent,
} from "@/lib/cookie-consent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export function CookieConsent() {
  const measurementId = getMeasurementId();
  const [mounted, setMounted] = useState(false);
  const [stored, setStored] = useState<StoredConsent | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [pendingAnalytics, setPendingAnalytics] = useState(false);

  // Hydrate: read stored choice and re-apply it (Consent Mode default is denied).
  useEffect(() => {
    setMounted(true);
    const current = readConsent();
    setStored(current);
    if (current) applyConsent(current.analytics);
  }, []);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<StoredConsent>).detail;
      setStored(detail);
    };
    const onOpen = () => {
      const current = readConsent();
      setPendingAnalytics(current?.analytics === "granted");
      setPrefsOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, onChange as EventListener);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange as EventListener);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpen);
    };
  }, []);

  // Do not render the banner (or load anything) without a valid GA4 ID.
  if (!measurementId || !mounted) return null;

  const showBanner = !stored && !prefsOpen;

  const savePrefs = () => {
    setConsent(pendingAnalytics ? "granted" : "denied");
    setPrefsOpen(false);
  };

  return (
    <>
      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-card/95 shadow-card backdrop-blur"
        >
          <div className="container-page flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:py-5">
            <p className="max-w-2xl text-sm text-foreground/85">
              We use optional analytics cookies to understand how people use
              OwnWay and improve the website. You can accept or reject analytics
              at any time.{" "}
              <Link
                to="/privacy"
                className="text-accent underline-offset-2 hover:underline"
              >
                Read our Privacy Policy
              </Link>
              .
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setPendingAnalytics(false);
                  setPrefsOpen(true);
                }}
              >
                Manage preferences
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setConsent("denied")}
              >
                Reject
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => setConsent("granted")}
              >
                Accept analytics
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={prefsOpen} onOpenChange={setPrefsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose which optional cookies OwnWay may use. You can change this
              at any time from the footer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-border/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Strictly necessary
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required for the site to work (security, form submission).
                    Always on.
                  </p>
                </div>
                <Switch checked disabled aria-label="Strictly necessary cookies (always on)" />
              </div>
            </div>

            <div className="rounded-xl border border-border/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label
                    htmlFor="analytics-consent"
                    className="text-sm font-medium text-foreground"
                  >
                    Analytics (Google Analytics 4)
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Helps us understand aggregate website use. No form values or
                    email addresses are ever sent to Google Analytics.
                  </p>
                </div>
                <Switch
                  id="analytics-consent"
                  checked={pendingAnalytics}
                  onCheckedChange={setPendingAnalytics}
                  aria-label="Enable analytics cookies"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setConsent("denied");
                setPrefsOpen(false);
              }}
            >
              Reject all
            </Button>
            <Button type="button" className="rounded-full" onClick={savePrefs}>
              Save preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
