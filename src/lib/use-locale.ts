import { useEffect, useState } from "react";

export type Locale = "it" | "en";

const LANGUAGE_STORAGE_KEY = "ownway_language";
const LANGUAGE_EVENT = "ownway:language-change";

/**
 * Shared language state for the public pages. Italian is the privacy-safe
 * default; the choice is persisted in localStorage and broadcast via a
 * custom event so other components can react.
 */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("it");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "it" || stored === "en") setLocale(stored);
    } catch {
      // Italian remains the privacy-safe default when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // The switch still works for the current visit.
    }
    window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: next }));
  };

  return { locale, changeLocale, it: locale === "it" };
}
