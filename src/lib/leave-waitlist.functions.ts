import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().min(16).max(128) });
const codeSchema = z.object({ referral_code: z.string().trim().min(4).max(64) });

const SITE_URL = "https://ownway.app";

/**
 * Tokens are hashed SERVER-SIDE only. The browser sends the raw token to this
 * trusted handler; no hash is ever created in, or returned to, client code.
 * Neither the token nor its hash is ever logged on any code path.
 */
async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Keyed HMAC of the caller IP — never an unsalted hash, never the raw IP. */
async function hmacIp(ip: string | undefined) {
  if (!ip) return null;
  const secret = process.env["LEAVE_IP_HMAC_KEY"];
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateLeaveToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "your email";
  const head = local.slice(0, 2);
  const dparts = domain.split(".");
  const dhead = (dparts[0] ?? "").slice(0, 2);
  const tld = dparts.slice(1).join(".");
  return `${head}${"•".repeat(Math.max(1, local.length - 2))}@${dhead}${"•".repeat(
    Math.max(1, (dparts[0] ?? "").length - 2),
  )}${tld ? "." + tld : ""}`;
}

/**
 * Read-only. Opening the leave link never deletes anything: this performs no
 * writes, so link scanners and prefetchers are harmless.
 */
export const getLeaveStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("leave_token_status", {
      p_token_hash: await hashToken(data.token),
    });
    if (error) throw new Error("status_unavailable");
    const row = (rows as any[])?.[0];
    return {
      status: (row?.status as string) ?? "invalid",
      masked_email: row?.email ? maskEmail(row.email as string) : null,
    };
  });

/** Explicit user action only. Hard-deletes everything atomically. */
export const performLeaveWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: outcome, error } = await supabaseAdmin.rpc("delete_waitlist_signup", {
      p_token_hash: await hashToken(data.token),
    });
    if (error) throw new Error("delete_failed");
    return { status: (outcome as string) ?? "invalid" };
  });

/**
 * Rate-limited: one email per signup per 15 minutes plus an hourly per-IP cap,
 * enforced in the database. A fresh token invalidates the previous one.
 * The response is always neutral — it never reveals an address or whether an
 * account exists.
 */
export const requestLeaveLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => codeSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const token = generateLeaveToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    let ipHmac: string | null = null;
    try {
      ipHmac = await hmacIp(getRequestIP({ xForwardedFor: true }));
    } catch {
      ipHmac = null;
    }

    const { data: rows } = await supabaseAdmin.rpc("request_leave_link", {
      p_referral_code: data.referral_code,
      p_token_hash: await hashToken(token),
      p_expires_at: expiresAt,
      p_ip_hmac: ipHmac,
    });

    const row = (rows as any[])?.[0];
    if (row?.allowed && row?.email) {
      try {
        const { sendTransactionalEmailInternal } = await import(
          "@/lib/email/send-internal.server"
        );
        await sendTransactionalEmailInternal({
          templateName: "leave-waitlist-link",
          recipientEmail: row.email as string,
          idempotencyKey: `leave-link-${Date.now()}-${data.referral_code}`,
          templateData: {
            siteUrl: SITE_URL,
            leaveUrl: `${SITE_URL}/leave-waitlist#t=${token}`,
          },
        });
      } catch {
        /* never surface delivery detail to the caller */
      }
    }

    // Same response in every branch.
    return { ok: true };
  });
