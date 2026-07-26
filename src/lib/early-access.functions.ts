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

function generateCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function computePosition(supabaseAdmin: any, priority_score: number, id: string) {
  // Position = 1 + number of rows ahead (lower priority_score, or same score but earlier id)
  const { count } = await supabaseAdmin
    .from("early_access_signups")
    .select("id", { count: "exact", head: true })
    .or(`priority_score.lt.${priority_score},and(priority_score.eq.${priority_score},id.lt.${id})`);
  return (count ?? 0) + 1;
}

export const submitEarlyAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendTransactionalEmailInternal } = await import("@/lib/email/send-internal.server");

    const SITE_URL = "https://ownway.app";

    async function sendConfirmationEmail(args: {
      email: string;
      position: number;
      referral_code: string;
      alreadyIn: boolean;
    }) {
      try {
        await sendTransactionalEmailInternal({
          templateName: "waitlist-confirmation",
          recipientEmail: args.email,
          idempotencyKey: `waitlist-confirm-${args.referral_code}-${args.alreadyIn ? "already" : "new"}`,
          templateData: {
            siteUrl: SITE_URL,
            email: args.email,
            position: args.position,
            referralCode: args.referral_code,
            referralUrl: `${SITE_URL}/?ref=${args.referral_code}`,
            waitlistUrl: `${SITE_URL}/waitlist/${args.referral_code}`,
            alreadyIn: args.alreadyIn,
          },
        });
      } catch (err) {
        // Never break signup on email failure
        console.error("Waitlist confirmation email failed", err);
      }
    }

    // Existing email?
    const { data: existing } = await supabaseAdmin
      .from("early_access_signups")
      .select("id, referral_code, priority_score")
      .ilike("email", data.email)
      .maybeSingle();

    if (existing?.referral_code) {
      // Re-confirm consent record on repeat submission from the form.
      await supabaseAdmin
        .from("early_access_signups")
        .update({
          consent_to_updates: true,
          consent_marketing: true,
          consent_marketing_at: new Date().toISOString(),
          consent_policy_version: data.consent_policy_version,
          consent_source: data.consent_source ?? data.source ?? null,
        })
        .eq("id", existing.id);
      const position = await computePosition(supabaseAdmin, existing.priority_score ?? 0, existing.id);
      await sendConfirmationEmail({
        email: data.email,
        position,
        referral_code: existing.referral_code,
        alreadyIn: true,
      });
      return { referral_code: existing.referral_code, position, already: true as const };
    }


    // Self-referral guard handled by code lookup later
    let referral_code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await supabaseAdmin
        .from("early_access_signups")
        .select("id")
        .eq("referral_code", referral_code)
        .maybeSingle();
      if (!clash) break;
      referral_code = generateCode();
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("early_access_signups")
      .insert({
        email: data.email,
        role: data.role,
        referral_code,
        referred_by: data.referred_by ?? null,
        source: data.source ?? null,
        consent_to_updates: true,
        consent_marketing: true,
        consent_marketing_at: new Date().toISOString(),
        consent_policy_version: data.consent_policy_version,
        consent_source: data.consent_source ?? data.source ?? null,
      })
      .select("id, priority_score, referral_code")
      .single();


    if (error || !inserted) throw new Error(error?.message ?? "Could not save signup");

    // Credit the referrer
    if (data.referred_by) {
      const { data: referrer } = await supabaseAdmin
        .from("early_access_signups")
        .select("id, referral_count")
        .eq("referral_code", data.referred_by)
        .maybeSingle();
      if (referrer && referrer.id !== inserted.id) {
        await supabaseAdmin
          .from("early_access_signups")
          .update({ referral_count: (referrer.referral_count ?? 0) + 1 })
          .eq("id", referrer.id);
      }
    }

    const position = await computePosition(supabaseAdmin, inserted.priority_score ?? 0, inserted.id);
    await sendConfirmationEmail({
      email: data.email,
      position,
      referral_code: inserted.referral_code,
      alreadyIn: false,
    });
    return { referral_code: inserted.referral_code, position, already: false as const };
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
      .select("id, email, role, destination, referral_code, referral_count, priority_score, consent_to_updates")
      .eq("referral_code", data.referral_code)
      .maybeSingle();
    if (!row) throw new Error("Signup not found");
    const position = await computePosition(supabaseAdmin, row.priority_score ?? 0, row.id);
    return {
      email: row.email as string,
      role: row.role as string,
      destination: row.destination as string | null,
      referral_code: row.referral_code as string,
      referral_count: row.referral_count as number,
      consent_to_updates: row.consent_to_updates as boolean,
      position,
    };
  });
