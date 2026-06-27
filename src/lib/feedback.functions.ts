import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FeedbackSchema = z.object({
  token: z.string().min(8),
  internal_match_score: z.number().int().min(1).max(5),
  internal_match_feedback: z.string().max(2000).optional().nullable(),
  understanding_score: z.number().int().min(1).max(5),
  advice_quality_score: z.number().int().min(1).max(5),
  accuracy_score: z.number().int().min(1).max(5),
  usefulness_score: z.number().int().min(1).max(5),
  overall_experience_score: z.number().int().min(1).max(5),
  most_useful_text: z.string().max(2000).optional().nullable(),
  improvement_text: z.string().max(2000).optional().nullable(),
  public_review_permission: z.boolean(),
});

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FeedbackSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { token, ...rest } = data;
    const { data: trip } = await supabaseAdmin
      .from("explorer_trip_requests")
      .select("id")
      .eq("private_trip_space_token", token)
      .maybeSingle();
    if (!trip) throw new Error("Trip not found");
    const { data: selectedMatch } = await supabaseAdmin
      .from("matched_waymakers")
      .select("waymaker_profile_id")
      .eq("explorer_trip_request_id", trip.id)
      .eq("explorer_selected", true)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("trip_feedback").insert({
      explorer_trip_request_id: trip.id,
      waymaker_profile_id: selectedMatch?.waymaker_profile_id ?? null,
      ...rest,
    });
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("explorer_trip_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", trip.id);
    if (selectedMatch?.waymaker_profile_id) {
      const wayScore = (rest.understanding_score + rest.advice_quality_score + rest.accuracy_score + rest.usefulness_score + rest.overall_experience_score) / 5;
      const { data: profile } = await supabaseAdmin
        .from("waymaker_profiles")
        .select("way_score_average, completed_helps_count")
        .eq("id", selectedMatch.waymaker_profile_id)
        .maybeSingle();
      const prevCount = profile?.completed_helps_count ?? 0;
      const prevAvg = Number(profile?.way_score_average ?? 0);
      const newCount = prevCount + 1;
      const newAvg = (prevAvg * prevCount + wayScore) / newCount;
      await supabaseAdmin
        .from("waymaker_profiles")
        .update({ way_score_average: newAvg, completed_helps_count: newCount })
        .eq("id", selectedMatch.waymaker_profile_id);
    }
    return { ok: true };
  });
