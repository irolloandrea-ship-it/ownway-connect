/**
 * Invite-code persistence for the OwnWay waitlist.
 *
 * sessionStorage only, first-touch wins. The code is cleared after a
 * successful signup. Nothing is persisted across browser sessions.
 */

const KEY = "ownway.ref";

/** Matches the server-side generator: 7 chars, no I/L/O/0/1. */
export const REFERRAL_CODE_RE = /^[A-HJ-NP-Z2-9]{7}$/;

export function isValidReferralCode(code: string | null | undefined): boolean {
  return typeof code === "string" && REFERRAL_CODE_RE.test(code);
}

/** Read the stored invite code, if any. */
export function getStoredReferralCode(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const v = window.sessionStorage.getItem(KEY);
    return isValidReferralCode(v) ? (v as string) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Capture `?ref=` from the current URL (or an explicit value).
 * First touch wins — an existing stored code is never overwritten.
 */
export function captureReferralCode(explicit?: string | null): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = getStoredReferralCode();
    if (existing) return existing;

    const raw =
      explicit ?? new URLSearchParams(window.location.search).get("ref") ?? undefined;
    if (!raw) return undefined;

    const code = raw.trim().toUpperCase();
    if (!isValidReferralCode(code)) return undefined;

    window.sessionStorage.setItem(KEY, code);
    return code;
  } catch {
    return undefined;
  }
}

/** Clear the stored invite code after a successful signup. */
export function clearReferralCode() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
