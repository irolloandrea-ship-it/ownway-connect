import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_waymaker_applications",
  title: "List WayMaker applications",
  description:
    "List submitted WayMaker applications, newest first. Optionally filter by review status.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .optional()
      .describe("How many applications to return (default 20, max 100)."),
    status: z.string().trim().optional().describe("Only return applications with this status."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 20, 1), 100);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("waymaker_applications")
      .select(
        "id, first_name, email, main_location, languages, travel_style_tags, preferred_help_methods, availability, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(take);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, applications: rows },
    };
  },
});
