import { auth, defineMcp } from "@lovable.dev/mcp-js";
import waitlistStats from "./tools/waitlist-stats";
import listWaitlistSignups from "./tools/list-waitlist-signups";
import getWaitlistSignup from "./tools/get-waitlist-signup";
import listWaymakerApplications from "./tools/list-waymaker-applications";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// Supabase value that survives publish unchanged and Vite inlines it at build time.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "ownwayapp-landingpage",
  title: "OwnwayApp_landingpage",
  version: "0.1.0",
  instructions:
    "Tools for the OwnWay early-access site. Read waitlist signups, waitlist stats, and WayMaker applications. All data is scoped to the signed-in OwnWay admin account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [waitlistStats, listWaitlistSignups, getWaitlistSignup, listWaymakerApplications],
});
