type TripInput = {
  destination_city: string;
  destination_country?: string | null;
  trip_duration: string;
  travel_group?: string | null;
  first_time_destination?: string | null;
  accommodation_area?: string | null;
  authenticity_comfort_score?: number | null;
  slow_intense_score?: number | null;
  famous_hidden_score?: number | null;
  planning_spontaneity_score?: number | null;
  movement_score?: number | null;
  queue_tolerance_score?: number | null;
  interests?: string[] | null;
  specific_request_text?: string | null;
  budget_style?: string | null;
  food_preferences?: string | null;
  mobility_constraints?: string | null;
  safety_concerns?: string | null;
  preferred_languages?: string[] | null;
};

function describeScore(label: string, val: number | null | undefined, lo: string, hi: string) {
  if (val == null) return null;
  if (val <= 2) return `${label}: leans toward ${lo}`;
  if (val >= 4) return `${label}: leans toward ${hi}`;
  return `${label}: balanced`;
}

export function buildMatchingPromptPacket(t: TripInput): string {
  const dest = [t.destination_city, t.destination_country].filter(Boolean).join(", ");
  const styleBits = [
    describeScore("Authenticity vs comfort", t.authenticity_comfort_score, "comfort", "authentic/local"),
    describeScore("Pace", t.slow_intense_score, "relaxed", "intense"),
    describeScore("Famous vs hidden", t.famous_hidden_score, "must-sees", "hidden places"),
    describeScore("Planning vs spontaneity", t.planning_spontaneity_score, "clear plan", "flexible"),
    describeScore("Movement", t.movement_score, "low movement", "happy to move"),
    describeScore("Queue tolerance", t.queue_tolerance_score, "hates queues", "patient for something special"),
  ].filter(Boolean).join("; ");

  const interests = t.interests?.length ? t.interests.join(", ") : "no specific interests listed";
  const needs: string[] = [];
  if (t.budget_style) needs.push(`budget style: ${t.budget_style}`);
  if (t.food_preferences) needs.push(`food: ${t.food_preferences}`);
  if (t.mobility_constraints) needs.push(`mobility: ${t.mobility_constraints}`);
  if (t.safety_concerns) needs.push(`safety: ${t.safety_concerns}`);
  if (t.preferred_languages?.length) needs.push(`languages: ${t.preferred_languages.join(", ")}`);

  return [
    `This Explorer is traveling to ${dest} for ${t.trip_duration}.`,
    `They are traveling as ${t.travel_group ?? "unspecified group"}, and it is their ${t.first_time_destination ?? "unspecified"} time in this destination.`,
    t.accommodation_area ? `They will stay in/near ${t.accommodation_area}.` : "",
    `Travel style — ${styleBits || "no slider preferences given"}.`,
    `Main interests: ${interests}.`,
    t.specific_request_text ? `Specific request: ${t.specific_request_text}` : "",
    needs.length ? `Practical needs — ${needs.join("; ")}.` : "",
    `The ideal WayMaker understands this kind of traveler and can help interpret ${t.destination_city} in their own way, not push a generic itinerary.`,
  ].filter(Boolean).join("\n\n");
}
