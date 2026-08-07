import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled drain for the referral notification outbox.
 *
 * Authentication: a private scheduled-job secret (`REFERRAL_JOB_SECRET`) held
 * only in server configuration. The anon/publishable key is NOT accepted, and
 * no service-role credential is ever exposed to browser code.
 */
export const Route = createFileRoute("/api/public/hooks/referral-notifications")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["REFERRAL_JOB_SECRET"];
        if (!expected) {
          return Response.json({ error: "not_configured" }, { status: 503 });
        }

        const header = request.headers.get("authorization") ?? "";
        const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

        const a = new TextEncoder().encode(provided);
        const b = new TextEncoder().encode(expected);
        let diff = a.length ^ b.length;
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
          diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
        }
        if (diff !== 0) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        const { drainReferralNotifications } = await import("@/lib/referral-notify.server");
        try {
          const result = await drainReferralNotifications(20);
          return Response.json({ ok: true, ...result });
        } catch (err: any) {
          console.error("referral notification drain failed", err);
          return Response.json({ ok: false, error: "drain_failed" }, { status: 500 });
        }
      },
    },
  },
});
