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
  - `getLeaveStatus` (GET, read-only) → token state + masked email
  - `performLeaveWaitlist` (POST) → calls the delete RPC
  - `requestLeaveLink` (POST, by referral code) → mints a new token, stores only the hash, emails the leave link to the address on file; always returns a neutral result so the code cannot be used to probe addresses
- `src/routes/leave-waitlist.tsx` — three states: confirm (with the exact warning wording), success ("You've left the OwnWay waitlist. Your waitlist data has been deleted."), and invalid/expired with a way to request a fresh link. `noindex`.
- `src/lib/email-templates/waitlist-confirmation.tsx` — quiet secondary line under the footer content: "Changed your mind? Leave the waitlist" linking to `/leave-waitlist?t=…`. Token minted in `submitEarlyAccess` alongside the confirmation token.
- New small template `leave-waitlist-link.tsx` for the "send me a leave link" request.
- `src/routes/waitlist.$code.tsx` — muted text link at the bottom that triggers `requestLeaveLink`.
- `src/routes/privacy.tsx` — a short factual section: how to leave, and exactly what is deleted from the live database (waitlist entry, referral credits, notification records, email send logs, unsubscribe tokens, queued unsent emails). It will state plainly that OwnWay cannot recall email already delivered to an inbox, and that provider-side logs and backup retention are covered separately rather than claiming erasure.

## Security

Same standards as the confirmation flow: high-entropy 32-byte token, SHA-256 hash stored only, single-use, expiring (14 days), constant-time comparison performed by hash equality inside the database, SECURITY DEFINER with pinned `search_path`, execute revoked from client roles, RLS unchanged (no client delete permission anywhere), and no token or hash written to logs.

## Testing — needs your decision

Destructive acceptance tests must not run against production or preview, and this project has no second Cloud backend. I cannot provision one from here. Options:

1. You create a separate staging Lovable Cloud project and I run the full suite there with synthetic addresses (repeated GET does nothing, only POST deletes, expired/used/invalid rejected, email gone from every audited table and the CSV export, referrer recalculation, referrer deletion leaves referred users intact, concurrent confirm+delete).
2. I ship the flow with the SQL logic verified by reasoning and static checks only, and you run the acceptance suite yourself before announcing it.

Tell me which and I'll proceed accordingly.

## Final report I will produce

Tables audited and their treatment (hard-delete vs. redact vs. untouched), what remains outside OwnWay's control (Mailgun provider logs, Supabase point-in-time backups — retention windows currently unverified), and an explicit production-readiness statement.
