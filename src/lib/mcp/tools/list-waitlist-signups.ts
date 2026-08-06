import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_waitlist_signups",
  title: "List waitlist signups",
  description:
    "List the most recent OwnWay early-access signups, newest first. Optionally filter by role (explorer = traveller, waymaker).",
  inputSchema: {
    limit: z.number().int().optional().describe("How many signups to return (default 20, max 100)."),
    role: z
      .enum(["explorer", "waymaker", "curious", "unknown"])
      .optional()
      .describe("Only return signups with this role."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, role }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("early_access_signups")
      .select(
        "email, role, destination, source, referral_code, referral_count, referred_by, consent_marketing, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(take);
    if (role) query = query.eq("role", role);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, signups: rows },
    };
  },
});
