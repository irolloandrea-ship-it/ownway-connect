import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email().max(255),
  role: z.enum(["explorer", "waymaker"]),
  source: z.string().trim().max(120).optional().nullable(),
  referred_by: z.string().trim().max(64).optional().nullable(),
  consent_marketing: z.literal(true, {
    errorMap: () => ({ message: "Marketing consent is required to join the waitlist." }),
  }),
  consent_policy_version: z.string().trim().min(1).max(64),
  consent_source: z.string().trim().max(120).optional().nullable(),
});


const updateSchema = z.object({
  referral_code: z.string().trim().min(4).max(64),
  role: z.enum(["explorer", "waymaker", "curious", "unknown"]).optional(),
  destination: z.string().trim().max(200).optional().nullable(),
  consent_to_updates: z.boolean().optional(),
});

const statusSchema = z.object({
  referral_code: z.string().trim().min(4).max(64),
});

/**
 * Waitlist position counts CONFIRMED members only. Unverified signups do not
 * appear in the queue and do not shift anyone else's position.
 * Ordering: priority_score, then base_position (deterministic, never by UUID).
 */
async function computePosition(
  supabaseAdmin: any,
  priority_score: number,
  base_position: number,
) {
  const { count } = await supabaseAdmin
    .from("early_access_signups")
    .select("id", { count: "exact", head: true })
    .not("email_verified_at", "is", null)
    .or(
      `priority_score.lt.${priority_score},and(priority_score.eq.${priority_score},base_position.lt.${base_position})`,
    );
  return (count ?? 0) + 1;
}

function generateConfirmToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitEarlyAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendTransactionalEmailInternal } = await import("@/lib/email/send-internal.server");

    const SITE_URL = "https://ownway.app";

    const token = generateConfirmToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    // Atomic insert-or-return-existing. A pending referral credit is created
    // ONLY when the signup row was genuinely inserted for the first time.
    const { data: rows, error: rpcError } = await supabaseAdmin.rpc("create_or_get_signup", {
      p_email: data.email,
      p_role: data.role,
      p_source: data.source ?? null,
      p_referred_by: data.referred_by ?? null,
      p_consent_policy_version: data.consent_policy_version,
      p_consent_source: data.consent_source ?? data.source ?? null,
      p_confirm_token_hash: tokenHash,
      p_confirm_token_expires_at: expiresAt,
    });
    if (rpcError) throw new Error(rpcError.message);

    const result = (rows as any[])?.[0];
    if (!result?.signup_id) throw new Error("Could not save signup");

    const referral_code = result.referral_code as string;
    const verified = Boolean(result.email_verified);
    const needsConfirmation = !verified;

    let position = 0;
    if (verified) {
      const { data: row } = await supabaseAdmin
        .from("early_access_signups")
        .select("priority_score, base_position")
        .eq("id", result.signup_id)
        .maybeSingle();
      position = await computePosition(
        supabaseAdmin,
        row?.priority_score ?? 0,
        row?.base_position ?? 0,
      );
    }

    try {
      await sendTransactionalEmailInternal({
        templateName: "waitlist-confirmation",
        recipientEmail: data.email,
        idempotencyKey: needsConfirmation
          ? `waitlist-confirm-${tokenHash.slice(0, 32)}`
          : `waitlist-already-${referral_code}`,
        templateData: {
          siteUrl: SITE_URL,
          email: data.email,
          position,
          referralCode: referral_code,
          referralUrl: `${SITE_URL}/?ref=${referral_code}`,
          waitlistUrl: `${SITE_URL}/wl/${referral_code}`,
          confirmUrl: `${SITE_URL}/confirm-email?t=${token}`,
          needsConfirmation,
          alreadyIn: !result.was_inserted,
        },
      });
    } catch (err) {
      // Never break signup on email failure
      console.error("Waitlist confirmation email failed", err);
    }

    return {
      referral_code,
      position,
      already: !result.was_inserted,
      needs_confirmation: needsConfirmation,
    };
  });



export const updateSignup = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { role?: string; destination?: string | null; consent_to_updates?: boolean } = {};
    if (data.role !== undefined) patch.role = data.role;
    if (data.destination !== undefined) patch.destination = data.destination;
    if (data.consent_to_updates !== undefined) patch.consent_to_updates = data.consent_to_updates;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin
      .from("early_access_signups")
      .update(patch)
      .eq("referral_code", data.referral_code);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getWaitlistStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("early_access_signups")
      .select(
        "id, email, role, destination, referral_code, referral_count, priority_score, base_position, consent_to_updates, email_verified_at",
      )
      .eq("referral_code", data.referral_code)
      .maybeSingle();
    if (!row) throw new Error("Signup not found");

    const verified = Boolean(row.email_verified_at);
    // Unverified signups have no visible position and do not affect the queue.
    const position = verified
      ? await computePosition(supabaseAdmin, row.priority_score ?? 0, row.base_position ?? 0)
      : 0;

    return {
      email: row.email as string,
      role: row.role as string,
      destination: row.destination as string | null,
      referral_code: row.referral_code as string,
      referral_count: row.referral_count as number,
      consent_to_updates: row.consent_to_updates as boolean,
      verified,
      position,
    };
  });

