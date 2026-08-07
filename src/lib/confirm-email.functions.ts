import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().min(16).max(128) });

async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Read-only. Safe for link scanners and email clients that pre-fetch URLs:
 * this performs no writes and awards nothing.
 */
export const getConfirmEmailStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: outcome, error } = await supabaseAdmin.rpc("confirm_email_status", {
      p_token_hash: await hashToken(data.token),
    });
    if (error) throw new Error(error.message);
    return { status: (outcome as string) ?? "invalid" };
  });

/**
 * Explicit user action only. Verifies the email, awards any pending referral
 * credit, updates the referrer's ranking and enqueues one outbox record —
 * all inside a single database transaction.
 */
export const confirmEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("confirm_email_and_award", {
      p_token_hash: await hashToken(data.token),
    });
    if (error) throw new Error(error.message);
    const row = (rows as any[])?.[0];

    // Best-effort immediate drain. The outbox is the durable record; the
    // secured scheduled endpoint retries anything left behind.
    if (row?.credit_awarded) {
      try {
        const { drainReferralNotifications } = await import("@/lib/referral-notify.server");
        await drainReferralNotifications(5);
      } catch (err) {
        console.error("immediate referral notification drain failed", err);
      }
    }

    return {
      status: (row?.outcome as string) ?? "invalid",
      referral_code: (row?.referral_code as string | null) ?? null,
      credit_awarded: Boolean(row?.credit_awarded),
    };
  });
