import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminListTrips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("explorer_trip_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: apps, error } = await supabaseAdmin
      .from("waymaker_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (apps ?? []).map((a: any) => a.id);
    const { data: dests } = ids.length
      ? await supabaseAdmin.from("waymaker_destinations").select("*").in("waymaker_id", ids)
      : { data: [] as any[] };
    return (apps ?? []).map((a: any) => ({ ...a, destinations: (dests ?? []).filter((d: any) => d.waymaker_id === a.id) }));
  });

export const adminListProfiles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("waymaker_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminApproveWaymaker = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      level: z.string().max(40).default("WayMaker"),
      bio: z.string().max(2000).optional().nullable(),
      bestForTags: z.array(z.string().max(60)).max(40).optional().nullable(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: app, error: ae } = await supabaseAdmin
      .from("waymaker_applications")
      .select("*")
      .eq("id", data.applicationId)
      .single();
    if (ae) throw new Error(ae.message);
    await supabaseAdmin
      .from("waymaker_applications")
      .update({ status: "approved" })
      .eq("id", app.id);
    const { error: pe } = await supabaseAdmin.from("waymaker_profiles").insert({
      waymaker_application_id: app.id,
      public_name: app.first_name,
      main_location: app.main_location,
      languages: app.languages,
      bio: data.bio ?? app.travel_style_description ?? null,
      travel_style_tags: app.travel_style_tags,
      best_for_tags: data.bestForTags ?? [],
      level: data.level,
      is_public: true,
    });
    if (pe) throw new Error(pe.message);
    return { ok: true };
  });

export const adminUpdateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.string().max(40), notes: z.string().max(2000).optional().nullable() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("waymaker_applications")
      .update({ status: data.status, admin_notes: data.notes ?? null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminAssignMatches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      tripId: z.string().uuid(),
      matches: z.array(z.object({
        waymaker_profile_id: z.string().uuid(),
        admin_match_reason: z.string().max(2000).optional().nullable(),
      })).min(1).max(3),
      adminNote: z.string().max(2000).optional().nullable(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("matched_waymakers").delete().eq("explorer_trip_request_id", data.tripId);
    const rows = data.matches.map((m) => ({ ...m, explorer_trip_request_id: data.tripId, status: "suggested" }));
    const { error } = await supabaseAdmin.from("matched_waymakers").insert(rows);
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("explorer_trip_requests")
      .update({ status: "matched", matched_at: new Date().toISOString(), admin_notes: data.adminNote ?? null })
      .eq("id", data.tripId);
    return { ok: true };
  });

export const adminListFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("city_feed_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertFeedPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid().optional().nullable(),
      city: z.string().min(1).max(120),
      country: z.string().max(120).optional().nullable(),
      category: z.string().min(1).max(40),
      title: z.string().min(1).max(200),
      description: z.string().max(4000).optional().nullable(),
      event_date: z.string().optional().nullable(),
      expiration_date: z.string().optional().nullable(),
      source: z.string().max(255).optional().nullable(),
      status: z.string().max(40).default("approved"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...payload } = data;
    if (id) {
      const { error } = await supabaseAdmin.from("city_feed_posts").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("city_feed_posts").insert({ ...payload, contributor_type: "admin" });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteFeedPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("city_feed_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListFeedback = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("trip_feedback")
      .select("*, explorer_trip_requests(destination_city, first_name, email), waymaker_profiles(public_name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [trips, apps, profiles, matches, feedback] = await Promise.all([
      supabaseAdmin.from("explorer_trip_requests").select("status, destination_city, interests"),
      supabaseAdmin.from("waymaker_applications").select("status"),
      supabaseAdmin.from("waymaker_profiles").select("id, way_score_average"),
      supabaseAdmin.from("matched_waymakers").select("status, explorer_selected"),
      supabaseAdmin.from("trip_feedback").select("internal_match_score, overall_experience_score"),
    ]);
    const tripRows = trips.data ?? [];
    const cityCounts: Record<string, number> = {};
    const interestCounts: Record<string, number> = {};
    tripRows.forEach((t: any) => {
      cityCounts[t.destination_city] = (cityCounts[t.destination_city] ?? 0) + 1;
      (t.interests ?? []).forEach((i: string) => { interestCounts[i] = (interestCounts[i] ?? 0) + 1; });
    });
    const fb = feedback.data ?? [];
    const avg = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
    return {
      tripCount: tripRows.length,
      applicationCount: (apps.data ?? []).length,
      approvedWaymakerCount: (profiles.data ?? []).length,
      matchedCount: (matches.data ?? []).filter((m: any) => m.status !== "suggested" || m.explorer_selected).length,
      avgInternalMatch: avg(fb.map((f: any) => f.internal_match_score).filter(Boolean)),
      avgWayScore: avg((profiles.data ?? []).map((p: any) => Number(p.way_score_average)).filter((x: number) => x > 0)),
      topCities: Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
      topInterests: Object.entries(interestCounts).sort((a, b) => b[1] - a[1]).slice(0, 12),
      feedbackCount: fb.length,
      highRatePct: fb.length ? Math.round(fb.filter((f: any) => f.internal_match_score >= 4).length / fb.length * 100) : 0,
    };
  });

export const adminGrantSelfAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) {
      const { data } = await supabaseAdmin.rpc("has_role", { _user_id: context.userId, _role: "admin" });
      if (!data) throw new Error("An admin already exists. Ask them to grant you access.");
      return { ok: true, alreadyAdmin: true };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true, granted: true };
  });

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const adminExportWaitlistCsv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("early_access_signups")
      .select("email, role, destination, referral_code, referred_by, referral_count, priority_score, base_position, consent_to_updates, source, created_at")
      .order("priority_score", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const headers = [
      "position", "email", "role", "destination", "referral_code",
      "referred_by", "referrals", "consent_to_updates", "source", "signed_up_at",
    ];
    const lines = [headers.join(",")];
    rows.forEach((r: any, i: number) => {
      lines.push([
        i + 1,
        r.email,
        r.role,
        r.destination,
        r.referral_code,
        r.referred_by,
        r.referral_count,
        r.consent_to_updates ? "yes" : "no",
        r.source,
        r.created_at,
      ].map(csvEscape).join(","));
    });
    return { csv: lines.join("\n"), count: rows.length };
  });

