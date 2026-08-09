# Leave the waitlist — privacy-first hard delete

## What I inspected first

- `early_access_signups` (15 rows), `referral_credits` (0), `referral_notification_outbox` (0)
- `email_send_log` (31 rows, stores `recipient_email`), `email_unsubscribe_tokens` (12 rows, stores `email`), `suppressed_emails` (3 rows)
- Email queues `pgmq.q_transactional_emails` and `pgmq.q_auth_emails` (both currently empty; payloads carry the recipient email)
- `prelaunch_analytics_events` — no row currently contains an email in `metadata` (email is never sent to analytics by design)
- Admin surfaces: `adminListWaitlist` and `adminExportWaitlistCsv` in `src/lib/admin.functions.ts`, both reading `early_access_signups` directly (the CSV is the Excel export)
- Existing confirmation flow to mirror: `confirm_email_status` / `confirm_email_and_award` RPCs + `src/lib/confirm-email.functions.ts` (SHA-256 token hash, read-only GET status, write only on POST)

## Flow

```text
email ──"Changed your mind? Leave the waitlist"──> /leave-waitlist?t=<token>
        (GET, read-only: shows warning, no writes)
                    │
                    └── explicit POST "Leave waitlist and delete my data"
                                    │
                                    └── delete_waitlist_signup(token_hash)  [atomic]
                                                    │
                                                    └── "You've left the OwnWay waitlist."
```

`/waitlist/<code>` gets a quiet text link "Leave the waitlist" (small, muted, below the main content — not a button, not competing with "Share your invite"). It does **not** delete: it emails a fresh leave link to the address already on file. The 7-character referral code alone never authorises deletion.

## Database changes (one migration)

1. Add to `early_access_signups`: `leave_token_hash text`, `leave_token_expires_at timestamptz`, `leave_token_used_at timestamptz`. Partial unique index on the hash. No plaintext token is ever stored, returned, or logged.
2. `leave_token_status(p_token_hash text) -> text` — STABLE SECURITY DEFINER, returns `valid | expired | already_used | invalid`. Read-only, safe for scanners and prefetchers.
3. `delete_waitlist_signup(p_token_hash text) -> text` — SECURITY DEFINER, `search_path = public`, does everything in one transaction:
   - resolve the row `FOR UPDATE`; abort unless the token is unused and unexpired
   - capture `email_normalized` locally, then:
     - hard-delete `referral_credits` where the person is referrer **or** referred; capture the affected referrer id when their credit was awarded
     - hard-delete related `referral_notification_outbox` rows that are not yet `sent`; for already-sent rows delete them too (they hold no email, only ids)
     - hard-delete the `early_access_signups` row
     - recompute the affected referrer's `referral_count` from remaining awarded credits and let the existing trigger recompute `priority_score`; position is derived by `waitlist_position()` so it updates automatically
   - hard-delete `email_unsubscribe_tokens` for that email
   - hard-delete `email_send_log` rows for that email (raw `recipient_email`, plus any address embedded in `error_message` or `metadata`)
   - hard-delete matching `suppressed_emails` rows — no raw-email suppression record is retained, and the person may sign up again later
   - purge any queued `pgmq` message whose payload targets that email (unsent jobs only), including template data carrying the address
   - before reporting completion, re-audit every application-owned table for any remaining raw-email column or JSON field (`early_access_signups`, `email_send_log`, `email_unsubscribe_tokens`, `suppressed_emails`, `prelaunch_analytics_events.metadata`, `explorer_trip_requests`, `waymaker_applications`, `trip_feedback`, both pgmq queues and their archives) and delete or irreversibly redact anything found
   - returns `deleted | expired | already_used | invalid`
4. `REVOKE EXECUTE` on both functions from `anon` and `authenticated`; server-only credentials call them. Referred people who signed up independently stay on the list; no dangling FKs remain because every referencing row is removed first.


## Application changes

- `src/lib/leave-waitlist.functions.ts`
  - `getLeaveStatus` (GET, read-only) → token state + masked email. The browser passes the raw token to this trusted server handler only; hashing happens server-side. No hash is ever computed in or returned to client code.
  - `performLeaveWaitlist` (POST) → hashes server-side, calls the delete RPC
  - `requestLeaveLink` (POST, by referral code) → mints a new token (which immediately invalidates the previous one by overwriting the stored hash), emails the leave link to the address on file; always returns a neutral result, never an email address or an account-existence signal
- `src/routes/leave-waitlist.tsx` — three states: confirm (with the exact warning wording), success ("You've left the OwnWay waitlist. Your waitlist data has been deleted."), and invalid/expired with a way to request a fresh link. `noindex`.
- `src/lib/email-templates/waitlist-confirmation.tsx` — quiet secondary line under the footer content: "Changed your mind? Leave the waitlist" linking to `/leave-waitlist?t=…`. Token minted in `submitEarlyAccess` alongside the confirmation token.
- New small template `leave-waitlist-link.tsx` for the "send me a leave link" request.
- `src/routes/waitlist.$code.tsx` — muted text link at the bottom that triggers `requestLeaveLink`.
- `src/routes/privacy.tsx` — a short factual section: how to leave, and exactly what is deleted from the live database (waitlist entry, referral credits, notification records, email send logs, unsubscribe tokens, suppression rows, queued unsent emails). It will state plainly that OwnWay cannot recall email already delivered to an inbox, and that provider-side logs and backup retention are reported separately rather than claimed as erased.

## Token leakage protection

- `src/lib/prelaunch-analytics.ts` and the GA4 page-view wiring: both `/leave-waitlist` and `/confirm-email` are excluded from analytics, or reported as a fixed path with no query string. The token, the full URL, and the referrer never reach GA4, analytics rows, server logs, or error reporting.
- Error reporting (`src/lib/error-capture.ts`, `lovable-error-reporting.ts`) strips the `t` parameter from any captured URL.
- Both token routes send `Cache-Control: no-store` and `Referrer-Policy: no-referrer` response headers, and the pages avoid outbound links that would carry a referrer.
- No server function logs the token or its hash on any code path, including error branches.

## Rate limiting for leave-link requests

- One leave email per signup per 15 minutes, plus an hourly per-IP cap, enforced server-side in the database (a small `leave_link_requests` table with signup id, hashed IP, timestamp; checked and written inside the same SECURITY DEFINER function). IP is read via `getRequestIP` and stored only as a hash.
- Exceeding a limit returns the same neutral response as success — no address, no existence signal, no differing timing branch beyond what the database naturally does.

## Cancelling claimed-but-unsent notifications

`drainReferralNotifications` re-checks, immediately before each send, that the recipient signup, the outbox row, and the referral credit still exist and are eligible. If a leave request removed them, the job is discarded/marked instead of sent. An email already accepted by the provider cannot be recalled — that will be stated explicitly in the report and in the privacy wording.

## Staging-only execution

All destructive work runs in a separate staging Cloud project with synthetic addresses. Nothing is created and deleted in production or preview. Acceptance tests to run there, with captured evidence (query output and export contents, not code review):

1. Repeated GET on `/leave-waitlist?t=…` changes nothing.
2. Only the explicit POST deletes.
3. Expired, used, and invalid tokens cannot delete.
4. The address is absent from every audited table and from the admin CSV/Excel export.
5. A referred person leaving recalculates the referrer's `referral_count`, `priority_score`, and position atomically.
6. A referrer leaving keeps referred people on the waitlist with no dangling references.
7. Concurrent confirm + delete produces no stale credit and no post-deletion email.
8. Deletion after a notification is claimed but before it is sent results in no send.
9. Leave-link rate limits hold per signup and per IP; a new token invalidates the old one.
10. No token or query string appears in analytics rows, GA4 payloads, or logs for either token route.

Before implementation starts I need the staging project — tell me when it exists (or link it) and I'll run the whole suite there.

## Final report I will produce

The exact tables audited with hard-delete vs. redact vs. untouched, evidence output for each destructive test, external-provider retention facts still unverified (Mailgun send/event logs, Supabase point-in-time backups), and an explicit production-readiness statement.

