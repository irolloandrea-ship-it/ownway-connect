import { useEffect } from "react";

/**
 * GTM custom dataLayer events.
 *
 * Pushes landing-page interaction events to window.dataLayer so tags in the
 * GTM container (GTM-K6GT864B) can trigger on them:
 *
 *   - click_cta          click on CTA buttons/links ("Get Early Access", etc.)
 *   - outbound_click     click on external links (different origin, incl. mailto:)
 *   - lead_form_start    first focus on a field inside a form
 *   - form_submit        any form submission
 *   - lead_form_complete form submission that succeeded (success message visible)
 *
 * The listeners are attached once per session (window.__gtmCustomListenersAttached)
 * and never alter design or behaviour. GTM itself is loaded in __root.tsx.
 */

type DlEvent = Record<string, unknown> & { event: string };

function push(event: DlEvent) {
  if (typeof window === "undefined") return;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(event);
}

function basePayload(el: Element) {
  const e = el as HTMLElement;
  return {
    element_text: (e.innerText || e.textContent || "").trim().slice(0, 120),
    element_id: e.id || undefined,
    element_classes: typeof e.className === "string" ? e.className : undefined,
    page_path: window.location.pathname,
    page_title: document.title,
  };
}

const CTA_PATTERN =
  /early access|accesso anticipato|richiedi|unisciti|join|iscriviti|diventa|become|scopri|get started|reserve|accedi|sign ?up|partecipa|reserve your spot/i;

function isCta(el: HTMLElement): boolean {
  const text = (el.innerText || el.textContent || "").trim();
  if (!text || text.length > 120) return false;
  return CTA_PATTERN.test(text);
}

function isOutbound(el: HTMLElement): boolean {
  const anchor = el.closest("a[href]") as HTMLAnchorElement | null;
  if (!anchor) return false;
  const href = anchor.getAttribute("href") || "";
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  try {
    return new URL(anchor.href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function attach() {
  const w = window as any;
  if (w.__gtmCustomListenersAttached) return;
  w.__gtmCustomListenersAttached = true;
  w.dataLayer = w.dataLayer || [];

  // Clicks: CTA buttons/links and outbound links.
  document.addEventListener(
    "click",
    (ev) => {
      const target = (ev.target as Element | null)?.closest(
        "a, button, [role='button']",
      ) as HTMLElement | null;
      if (!target) return;
      if (isOutbound(target)) {
        push({ event: "outbound_click", ...basePayload(target) });
      } else if (isCta(target)) {
        push({ event: "click_cta", ...basePayload(target) });
      }
    },
    true,
  );

  // Forms: lead_form_start on first field focus, form_submit + outcome on submit.
  document.addEventListener(
    "focusin",
    (ev) => {
      const field = ev.target as HTMLElement | null;
      if (!field || !field.closest("form")) return;
      if (!/^(INPUT|TEXTAREA|SELECT)$/.test(field.tagName)) return;
      if (w.__gtmLeadFormStarted) return;
      w.__gtmLeadFormStarted = true;
      push({ event: "lead_form_start", ...basePayload(field) });
    },
    true,
  );

  document.addEventListener(
    "submit",
    (ev) => {
      const form = ev.target as HTMLFormElement | null;
      if (!form) return;
      push({ event: "form_submit", ...basePayload(form) });

      // lead_form_complete: fire once a success/confirmation toast is visible
      // (the waitlist flow shows a sonner success toast after submit).
      const observer = new MutationObserver(() => {
        const toast = document.querySelector(
          "[data-sonner-toast][data-type='success']",
        );
        if (toast) {
          observer.disconnect();
          push({ event: "lead_form_complete", ...basePayload(form) });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // Safety: stop observing after 15s if no success message appears.
      window.setTimeout(() => observer.disconnect(), 15000);
    },
    true,
  );
}

export function GtmEvents() {
  useEffect(() => {
    attach();
  }, []);
  return null;
}
