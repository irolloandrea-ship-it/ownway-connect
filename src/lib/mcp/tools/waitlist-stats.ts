import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "waitlist_stats",
  title: "Waitlist stats",
  description:
    "Summary of the OwnWay early-access waitlist: total signups, split by role, signups in the last 7 days, and total referrals.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("early_access_signups")
      .select("role, created_at, referral_count");
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const byRole: Record<string, number> = {};
    let last7Days = 0;
    let totalReferrals = 0;
    for (const row of rows) {
      byRole[row.role] = (byRole[row.role] ?? 0) + 1;
      if (new Date(row.created_at).getTime() >= weekAgo) last7Days += 1;
      totalReferrals += row.referral_count ?? 0;
    }
    const summary = { total: rows.length, byRole, last7Days, totalReferrals };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
