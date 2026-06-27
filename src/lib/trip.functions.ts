import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildMatchingPromptPacket } from "./matching-packet";

const TripSchema = z.object({
  first_name: z.string().trim().max(80).optional().nullable(),
  email: z.string().trim().email().max(255),
  destination_city: z.string().trim().min(1).max(120),
  destination_country: z.string().trim().max(120).optional().nullable(),
  travel_start_date: z.string().optional().nullable(),
  travel_end_date: z.string().optional().nullable(),
  trip_duration: z.string().min(1).max(60),
  travel_group: z.string().max(60).optional().nullable(),
  first_time_destination: z.string().max(80).optional().nullable(),
  accommodation_area: z.string().max(300).optional().nullable(),
  already_planned_text: z.string().max(2000).optional().nullable(),
  authenticity_comfort_score: z.number().int().min(1).max(5).optional().nullable(),
  slow_intense_score: z.number().int().min(1).max(5).optional().nullable(),
  famous_hidden_score: z.number().int().min(1).max(5).optional().nullable(),
  planning_spontaneity_score: z.number().int().min(1).max(5).optional().nullable(),
  movement_score: z.number().int().min(1).max(5).optional().nullable(),
  queue_tolerance_score: z.number().int().min(1).max(5).optional().nullable(),
  interests: z.array(z.string().max(60)).max(40).optional().nullable(),
  specific_request_text: z.string().max(2000).optional().nullable(),
  budget_style: z.string().max(60).optional().nullable(),
  food_preferences: z.string().max(1000).optional().nullable(),
  mobility_constraints: z.string().max(1000).optional().nullable(),
  safety_concerns: z.string().max(1000).optional().nullable(),
  preferred_languages: z.array(z.string().max(60)).max(20).optional().nullable(),
  consent_to_match: z.literal(true),
});

export const submitTripRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TripSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const packet = buildMatchingPromptPacket(data);
    const insert = { ...data, matching_prompt_packet: packet, status: "matching_pending" };
    const { data: row, error } = await supabaseAdmin
      .from("explorer_trip_requests")
      .insert(insert)
      .select("private_trip_space_token")
      .single();
    if (error) throw new Error(error.message);
    return { token: row.private_trip_space_token as string };
  });

export const getTripByToken = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(8).max(128) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: trip, error } = await supabaseAdmin
      .from("explorer_trip_requests")
      .select("*")
      .eq("private_trip_space_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!trip) throw new Error("Trip not found");

    const { data: matches } = await supabaseAdmin
      .from("matched_waymakers")
      .select("*, waymaker_profiles(*)")
      .eq("explorer_trip_request_id", trip.id);

    return { trip, matches: matches ?? [] };
  });

export const selectWaymaker = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(8), matchId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: trip } = await supabaseAdmin
      .from("explorer_trip_requests")
      .select("id")
      .eq("private_trip_space_token", data.token)
      .maybeSingle();
    if (!trip) throw new Error("Trip not found");
    const { error } = await supabaseAdmin
      .from("matched_waymakers")
      .update({ explorer_selected: true, status: "selected_by_explorer", selected_at: new Date().toISOString() })
      .eq("id", data.matchId)
      .eq("explorer_trip_request_id", trip.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("explorer_trip_requests")
      .update({ status: "contacted" })
      .eq("id", trip.id);
    return { ok: true };
  });
