/**
 * Server-only helpers for the referral notification outbox.
 *
 * Delivery guarantee: one durable outbox record per awarded referral credit and
 * at-least-once delivery attempts. `referral_credit_id` is passed to the email
 * provider as a stable idempotency key and the provider acceptance is persisted
 * BEFORE the row is marked `sent`, so a crash between acceptance and bookkeeping
 * does not re-send. Until provider-side deduplication on that key is evidenced
 * in staging, the accurate guarantee remains: rare duplicate delivery is
 * possible after a worker crash.
 */

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalEmailInternal } from "@/lib/email/send-internal.server";

const SITE_URL = "https://ownway.app";

async function computeVerifiedPosition(priority_score: number, base_position: number) {
  const { count } = await supabaseAdmin
    .from("early_access_signups")
    .select("id", { count: "exact", head: true })
    .not("email_verified_at", "is", null)
    .or(
      `priority_score.lt.${priority_score},and(priority_score.eq.${priority_score},base_position.lt.${base_position})`,
    );
  return (count ?? 0) + 1;
}

export async function drainReferralNotifications(limit = 20) {
  const { data: claimed, error } = await supabaseAdmin.rpc(
    "claim_referral_notifications",
    { p_limit: limit },
  );
  if (error) throw new Error(error.message);

  let sent = 0;
  let suppressed = 0;
  let failed = 0;

  for (const job of (claimed ?? []) as any[]) {
    try {
      // Provider already accepted this message on a previous attempt — do not re-send.
      if (job.provider_accepted_at) {
        await supabaseAdmin.rpc("mark_referral_notification", {
          p_outbox_id: job.outbox_id,
          p_status: "sent",
          p_accepted: true,
        });
        sent++;
        continue;
      }

      const { data: recipient } = await supabaseAdmin
        .from("early_access_signups")
        .select(
          "email, referral_code, referral_count, priority_score, base_position, consent_to_updates, consent_marketing, email_verified_at",
        )
        .eq("id", job.recipient_signup_id)
        .maybeSingle();

      // The credit and ranking update stay valid; only the email is suppressed.
      if (
        !recipient ||
        !recipient.email_verified_at ||
        !(recipient.consent_to_updates && recipient.consent_marketing)
      ) {
        await supabaseAdmin.rpc("mark_referral_notification", {
          p_outbox_id: job.outbox_id,
          p_status: "suppressed",
          p_error: "no_marketing_consent_or_unverified",
        });
        suppressed++;
        continue;
      }

      const position = await computeVerifiedPosition(
        recipient.priority_score ?? 0,
        recipient.base_position ?? 0,
      );

      const res = await sendTransactionalEmailInternal({
        templateName: "referral-credited",
        recipientEmail: recipient.email as string,
        // Stable idempotency key: one credit == one message.
        idempotencyKey: `referral-credit-${job.referral_credit_id}`,
        templateData: {
          siteUrl: SITE_URL,
          count: recipient.referral_count ?? 0,
          position,
          waitlistUrl: `${SITE_URL}/wl/${recipient.referral_code}`,
          referralUrl: `${SITE_URL}/?ref=${recipient.referral_code}`,
        },
      });

      if (!res.ok) {
        if (res.reason === "email_suppressed") {
          await supabaseAdmin.rpc("mark_referral_notification", {
            p_outbox_id: job.outbox_id,
            p_status: "suppressed",
            p_error: res.reason,
          });
          suppressed++;
          continue;
        }
        await supabaseAdmin.rpc("mark_referral_notification", {
          p_outbox_id: job.outbox_id,
          p_status: job.attempts >= 5 ? "failed" : "pending",
          p_error: res.reason ?? "send_failed",
        });
        failed++;
        continue;
      }

      // Persist provider acceptance first, then mark sent.
      await supabaseAdmin.rpc("mark_referral_notification", {
        p_outbox_id: job.outbox_id,
        p_status: "claimed",
        p_provider_message_id: res.messageId ?? null,
        p_accepted: true,
      });
      await supabaseAdmin.rpc("mark_referral_notification", {
        p_outbox_id: job.outbox_id,
        p_status: "sent",
        p_accepted: true,
      });
      sent++;
    } catch (err) {
      await supabaseAdmin.rpc("mark_referral_notification", {
        p_outbox_id: job.outbox_id,
        p_status: job.attempts >= 5 ? "failed" : "pending",
        p_error: err instanceof Error ? err.message : "unknown_error",
      });
      failed++;
    }
  }

  return { claimed: (claimed ?? []).length, sent, suppressed, failed };
}
