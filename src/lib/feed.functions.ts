import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getFeed = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({
      city: z.string().max(120).optional().nullable(),
      category: z.string().max(40).optional().nullable(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("city_feed_posts")
      .select("id, city, country, category, title, description, event_date, expiration_date, source, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data.city) q = q.ilike("city", data.city);
    if (data.category) q = q.eq("category", data.category);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getFeedCities = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("city_feed_posts")
    .select("city")
    .eq("status", "approved");
  const set = new Set<string>();
  (data ?? []).forEach((r) => r.city && set.add(r.city));
  return Array.from(set).sort();
});
