import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  role: z.enum(["explorer", "waymaker", "curious"]),
  destination: z.string().trim().max(200).optional().nullable(),
  source: z.string().trim().max(120).optional().nullable(),
  referred_by: z.string().trim().max(64).optional().nullable(),
});

function generateCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export const submitEarlyAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Try to find existing signup for this email+role
    const { data: existing } = await supabaseAdmin
      .from("early_access_signups")
      .select("referral_code")
      .ilike("email", data.email)
      .eq("role", data.role)
      .maybeSingle();

    if (existing?.referral_code) {
      return { referral_code: existing.referral_code, already: true as const };
    }

    // Generate a unique referral code
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

    const { error } = await supabaseAdmin.from("early_access_signups").insert({
      email: data.email,
      role: data.role,
      destination: data.destination ?? null,
      source: data.source ?? null,
      referral_code,
      referred_by: data.referred_by ?? null,
    });

    if (error) throw new Error(error.message);
    return { referral_code, already: false as const };
  });
