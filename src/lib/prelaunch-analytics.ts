import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "ownway_prelaunch_source_v1";

type UtmData = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  source: string;
};

function deriveSource(utm_source: string | null, referrer: string | null): string {
  if (utm_source) return utm_source;
  if (referrer) {
    const r = referrer.toLowerCase();
    if (r.includes("instagram")) return "instagram";
    if (r.includes("tiktok")) return "tiktok";
    if (r.includes("reddit")) return "reddit"; 
    if (r.includes("google")) return "google";
    return "referral";
  }
  return "direct";
}

function readStored(): UtmData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UtmData;
  } catch {
    return null;
  }
}

function writeStored(data: UtmData) {
  if (typeof window === "undefined") return;
  try {
    const str = JSON.stringify(data);
    window.sessionStorage.setItem(STORAGE_KEY, str);
    window.localStorage.setItem(STORAGE_KEY, str);
  } catch {
    /* ignore */
  }
}

export function captureSourceOnce(): UtmData {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null, referrer: null, source: "direct" };
  }
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get("utm_source");
  const utm_medium = params.get("utm_medium");
  const utm_campaign = params.get("utm_campaign");
  const utm_content = params.get("utm_content");
  const utm_term = params.get("utm_term");
  const referrer = document.referrer || null;
  const hasUtm = utm_source || utm_medium || utm_campaign || utm_content || utm_term;

  const existing = readStored();
  if (existing && !hasUtm) return existing;

  const data: UtmData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    referrer,
    source: deriveSource(utm_source, referrer),
  };
  writeStored(data);
  return data;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type ExtraPayload = {
  button_text?: string;
  button_location?: string;
  email?: string;
  metadata?: Record<string, unknown>;
};

export async function trackPrelaunchEvent(
  eventName: "page_view" | "cta_click" | "email_signup",
  payload: ExtraPayload = {},
) {
  if (typeof window === "undefined") return;
  try {
    const src = readStored() ?? captureSourceOnce();
    const row = {
      event_name: eventName,
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: src.referrer,
      button_text: payload.button_text ?? null,
      button_location: payload.button_location ?? null,
      email: payload.email ?? null,
      email_normalized: payload.email ? normalizeEmail(payload.email) : null,
      utm_source: src.utm_source,
      utm_medium: src.utm_medium,
      utm_campaign: src.utm_campaign,
      utm_content: src.utm_content,
      utm_term: src.utm_term,
      source: src.source,
      metadata: payload.metadata ?? null,
    };
    const { error } = await supabase.from("prelaunch_analytics_events").insert(row);
    if (error) console.error("[prelaunch analytics]", error);
  } catch (err) {
    console.error("[prelaunch analytics]", err);
  }
}
