import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const secret = url.searchParams.get("secret");
        if (!secret || secret !== process.env.BOOTSTRAP_ADMIN_SECRET) {
          return new Response("Unauthorized", { status: 401 });
        }

        const email = process.env.BOOTSTRAP_ADMIN_EMAIL!;
        const password = process.env.BOOTSTRAP_ADMIN_PASSWORD!;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Find or create the user
        let userId: string | undefined;
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (existing) {
          userId = existing.id;
        } else {
          const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });
          if (createErr || !created?.user) {
            return new Response(`Create failed: ${createErr?.message ?? "unknown"}`, { status: 500 });
          }
          userId = created.user.id;
        }

        // Grant admin role (idempotent)
        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
        if (roleErr) {
          return new Response(`Role grant failed: ${roleErr.message}`, { status: 500 });
        }

        return new Response(
          JSON.stringify({ ok: true, email, userId, message: "Admin ready. Sign in at /auth" }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
