import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_waitlist_signup",
  title: "Get waitlist signup",
  description:
    "Look up one OwnWay waitlist signup by email address or referral code, including its referral count.",
  inputSchema: {
    email: z.string().trim().optional().describe("Email address of the signup."),
    referral_code: z.string().trim().optional().describe("Referral code of the signup."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ email, referral_code }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!email && !referral_code) {
      return {
        content: [{ type: "text", text: "Provide either an email or a referral_code." }],
        isError: true,
      };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("early_access_signups")
      .select(
        "email, role, destination, source, referral_code, referral_count, referred_by, base_position, priority_score, consent_marketing, created_at, updated_at",
      )
      .limit(1);
    query = email
      ? query.eq("email_normalized", email.trim().toLowerCase())
      : query.eq("referral_code", referral_code!.toUpperCase());

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const row = data?.[0];
    if (!row) {
      return { content: [{ type: "text", text: "No matching signup found." }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      structuredContent: { signup: row },
    };
  },
});
