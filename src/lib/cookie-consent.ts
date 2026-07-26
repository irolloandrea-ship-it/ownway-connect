// Client-side helpers for cookie / Google Analytics consent.
// Consent Mode v2 defaults are set to "denied" in src/routes/__root.tsx before
// any tag loads. This module lets the UI grant / deny analytics after that.

export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "ownway_cookie_consent_v1";
export const CONSENT_POLICY_VERSION = "2026-07-26";
export const CONSENT_EVENT = "ownway:consent-change";
export const OPEN_COOKIE_SETTINGS_EVENT = "ownway:open-cookie-settings";

export type StoredConsent = {
  analytics: ConsentChoice;
  decidedAt: string; // ISO timestamp
  policyVersion: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getMeasurementId(): string | null {
  const raw = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? "";
  const id = raw.trim();
  // Only accept the GA4 shape; refuse to render banner/load scripts otherwise.
  return /^G-[A-Z0-9]+$/i.test(id) ? id : null;
}

export function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.analytics !== "granted" && parsed.analytics !== "denied") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(analytics: ConsentChoice): StoredConsent {
  const record: StoredConsent = {
    analytics,
    decidedAt: new Date().toISOString(),
    policyVersion: CONSENT_POLICY_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* ignore */
  }
  return record;
}

let gaLoaded = false;

function loadGtagScript(measurementId: string) {
  if (gaLoaded) return;
  if (document.querySelector(`script[data-ga-loader="1"]`)) {
    gaLoaded = true;
    return;
  }
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  s.setAttribute("data-ga-loader", "1");
  document.head.appendChild(s);
  gaLoaded = true;
}

function removeAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  // Try to expire common GA cookies for this host and its parent domain.
  const domains = [host, "." + host, "." + host.split(".").slice(-2).join(".")];
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_") || n.startsWith("_gid") || n.startsWith("_gat"));
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

export function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  const measurementId = getMeasurementId();
  const gtag = window.gtag;

  if (choice === "granted") {
    if (gtag) gtag("consent", "update", { analytics_storage: "granted" });
    if (measurementId) {
      loadGtagScript(measurementId);
      // Manual page_view tracking is driven by the router; disable auto send.
      if (gtag)
        gtag("config", measurementId, {
          anonymize_ip: true,
          send_page_view: false,
        });
      // Send an initial page_view for the current location.
      trackPageView();
    }
  } else {
    if (gtag) gtag("consent", "update", { analytics_storage: "denied" });
    // Best-effort: prevent further GA sends from any already-loaded script.
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${measurementId ?? ""}`
    ] = true;
    removeAnalyticsCookies();
  }
}

export function setConsent(choice: ConsentChoice): StoredConsent {
  const record = writeConsent(choice);
  applyConsent(choice);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  // Record the consent decision itself (only fires post-grant for "granted";
  // for "denied" this is a no-op because gtag consent is denied).
  trackAnalyticsEvent(
    choice === "granted" ? "consent_accepted" : "consent_rejected",
  );
  return record;
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

// Low-risk aggregate analytics event helper. No-ops until consent granted.
export function trackAnalyticsEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent || consent.analytics !== "granted") return;
  const gtag = window.gtag;
  if (!gtag) return;
  gtag("event", name, params ?? {});
}

// Manual page_view. Sends only the path — never query strings, which may
// contain referral codes or other identifiers.
export function trackPageView(pathOverride?: string) {
  if (typeof window === "undefined") return;
  const measurementId = getMeasurementId();
  if (!measurementId) return;
  const consent = readConsent();
  if (!consent || consent.analytics !== "granted") return;
  const gtag = window.gtag;
  if (!gtag) return;
  const page_path = pathOverride ?? window.location.pathname;
  gtag("event", "page_view", {
    page_path,
    page_location: `${window.location.origin}${page_path}`,
    page_title: document.title,
  });
}

