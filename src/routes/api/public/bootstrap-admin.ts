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
          // Keep the account in sync with the configured credentials (idempotent reset).
          const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password,
            email_confirm: true,
          });
          if (updateErr) {
            return new Response(`Password sync failed: ${updateErr.message}`, { status: 500 });
          }
        } else {
          // No account on the configured email. If a single existing admin account
          // is present, rename it instead of creating a duplicate admin.
          const { data: admins } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
          const soleAdminId = admins?.length === 1 ? admins[0]!.user_id : undefined;

          if (soleAdminId) {
            const { error: renameErr } = await supabaseAdmin.auth.admin.updateUserById(soleAdminId, {
              email,
              password,
              email_confirm: true,
            });
            if (renameErr) {
              return new Response(`Email/password update failed: ${renameErr.message}`, { status: 500 });
            }
            userId = soleAdminId;
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
