import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DestSchema = z.object({
  city: z.string().min(1).max(120),
  country: z.string().max(120).optional().nullable(),
  relationship_to_destination: z.string().max(60).optional().nullable(),
  confidence_level: z.number().int().min(1).max(5).optional().nullable(),
});

const AppSchema = z.object({
  first_name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  main_location: z.string().trim().min(1).max(120),
  languages: z.array(z.string().max(60)).max(20),
  destinations: z.array(DestSchema).min(1).max(20),
  travel_style_tags: z.array(z.string().max(60)).max(40),
  travel_style_description: z.string().max(2000).optional().nullable(),
  preferred_help_methods: z.array(z.string().max(60)).max(20),
  availability: z.string().max(60).optional().nullable(),
  preferred_contact_method: z.string().max(60).optional().nullable(),
  motivation_text: z.string().min(1).max(2000),
  useful_advice_text: z.string().min(1).max(2000),
  instagram_url: z.string().max(255).optional().nullable(),
  linkedin_url: z.string().max(255).optional().nullable(),
  blog_url: z.string().max(255).optional().nullable(),
  google_maps_url: z.string().max(255).optional().nullable(),
  other_url: z.string().max(255).optional().nullable(),
  consent_to_profile_review: z.literal(true),
});

export const submitWaymakerApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AppSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { destinations, ...app } = data;
    const { data: row, error } = await supabaseAdmin
      .from("waymaker_applications")
      .insert(app)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    if (destinations.length) {
      const dests = destinations.map((d) => ({ ...d, waymaker_id: row.id }));
      await supabaseAdmin.from("waymaker_destinations").insert(dests);
    }
    return { ok: true };
  });

export const getPublicWaymakers = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("waymaker_profiles")
    .select("id, public_name, main_location, languages, bio, travel_style_tags, best_for_tags, level, way_score_average, completed_helps_count")
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getWaymakerProfile = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile, error } = await supabaseAdmin
      .from("waymaker_profiles")
      .select("id, public_name, main_location, languages, bio, travel_style_tags, best_for_tags, level, way_score_average, completed_helps_count, waymaker_application_id, is_public")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile || !profile.is_public) throw new Error("Profile not found");
    let destinations: Array<{ city: string; country: string | null; relationship_to_destination: string | null; confidence_level: number | null }> = [];
    if (profile.waymaker_application_id) {
      const { data: d } = await supabaseAdmin
        .from("waymaker_destinations")
        .select("city, country, relationship_to_destination, confidence_level")
        .eq("waymaker_id", profile.waymaker_application_id);
      destinations = d ?? [];
    }
    return { profile, destinations };
  });
