# Referral flow hardening — revision 3 (pre-implementation scope)

All previously confirmed decisions stand: ledger, atomic score update, five-point rule, deterministic position, staging-only testing, analytics PII removal, sessionStorage-only referral capture, scanner-safe confirmation, durable outbox.

Verified against production before this revision:
- `early_access_signups`: 15 rows, **0** with `referred_by`, **0** with `referral_count > 0` → no backfill.
- A unique index already exists: `early_access_signups_email_unique` on `lower(email)`. Duplicate protection is therefore already database-enforced; this plan makes it canonical and explicit.

---

## 1. Invite-code persistence (unchanged)

`src/lib/referral-code.ts`: sessionStorage only, first-touch wins, cleared after a successful signup. Format check matches the existing generator exactly — 7 chars from `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (`^[A-HJ-NP-Z2-9]{7}$`). Captured on `/`, `/find-a-waymaker`, `/become-a-waymaker`; read by `EmailCapture` and `JoinEarlyAccess`. Server re-validates the code against `early_access_signups`; unknown or self-referring codes are silently dropped.

## 2. Database-enforced canonical email

- Add `email_normalized text generated always as (lower(btrim(email))) stored`.
- Migration first asserts no collisions (`select email_normalized, count(*) ... having count(*) > 1`) and aborts if any exist.
- Add `unique (email_normalized)`, then drop the older `lower(email)` expression index once the new constraint is in place.
- All lookups (`submitEarlyAccess`, admin, MCP tools) switch from `ilike` to equality on `email_normalized`. `ilike` is never the sole protection again.

## 3. Atomic insert-or-return-existing

`submitEarlyAccess` calls one `SECURITY DEFINER` RPC, `create_or_get_signup(...)`, that runs in a single transaction:

```
insert into early_access_signups (email, role, referral_code, referred_by, source, consent_*)
values (...)
on conflict (email_normalized) do nothing
returning id, referral_code, base_position;
```

- If a row is returned → `was_inserted = true`. Only in this branch does the RPC insert the `pending` referral credit (same transaction, so signup + pending credit commit atomically).
- If no row is returned → re-select the existing row, refresh consent fields only, and return `was_inserted = false`. **No credit is created, attached, replaced, or modified.** `referred_by` on an existing row is never overwritten.
- Referral-code uniqueness collisions retry inside the RPC (bounded loop) rather than in application code.

## 4. Verified-only waitlist

- New columns: `email_verified_at`, `confirm_token_hash`, `confirm_token_expires_at`, `confirm_token_used_at`.
- **An email is a waitlist member only once confirmation succeeds.** Unverified rows:
  - are excluded from `getWaitlistStatus` (returns a "confirm your email to secure your place" state instead of a number);
  - are excluded from the position-count predicate, so they consume no visible position and cannot shift anyone;
  - cannot produce an `awarded` credit — only confirmed rows are eligible.
- Position query becomes: count of rows with `email_verified_at is not null` ranked by `priority_score`, tie-broken by `base_position`, falling back to `created_at`. Never by UUID.
- The confirmation page states plainly, above the button: **"Confirming secures your place on the OwnWay waitlist."**

## 5. Scanner-safe confirmation

- Only the SHA-256 hash of the token is stored; the raw token exists only in the email link. Expiry 14 days, single use.
- `GET /confirm-email?t=…` is a pure render — a read-only server function returns `valid | expired | already_used | invalid`. No writes.
- An explicit user **POST** performs verification and award.
- Repeat GETs and repeat POSTs are idempotent no-ops.

## 6. Award transaction — exact boundaries

RPC `confirm_email_and_award(p_token_hash text)`, `SECURITY DEFINER`, `SET search_path = public`, `REVOKE EXECUTE FROM public, anon, authenticated`, `GRANT EXECUTE TO service_role`. One transaction:

1. `SELECT … FROM early_access_signups WHERE confirm_token_hash = $1 FOR UPDATE`. Missing / expired / already used → return outcome, no writes.
2. Set `email_verified_at = now()`, `confirm_token_used_at = now()`.
3. `UPDATE referral_credits SET status='awarded', awarded_at=now() WHERE referred_signup_id = <id> AND status='pending' RETURNING id`. Zero rows → verification succeeds, no credit, done.
4. `SELECT … FROM early_access_signups WHERE id = referrer_signup_id FOR UPDATE` (referrer locked after the referred row; consistent ordering avoids deadlocks).
5. `referral_count := count(*) from referral_credits where referrer_signup_id = r and status='awarded'` (derived, never incremented); `UPDATE` the referrer. The existing `early_access_before_update` trigger recomputes **`priority_score = base_position − (referral_count × 5)`** — rule preserved verbatim.
6. `INSERT INTO referral_notification_outbox (referral_credit_id, …) ON CONFLICT DO NOTHING` — same transaction, so credit and outbox row commit together.

## 7. `referral_credits`

```sql
create table public.referral_credits (
  id uuid primary key default gen_random_uuid(),
  referrer_signup_id uuid not null references public.early_access_signups(id) on delete cascade,
  referred_signup_id uuid not null unique references public.early_access_signups(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','awarded','void')),
  created_at timestamptz not null default now(),
  awarded_at timestamptz
);
```
`referred_signup_id` is the sole one-credit key; no duplicated email column (no retention or legal reason). `service_role` grants only; RLS on; admin read policy via `public.is_admin()`.

## 8. Notification outbox and honest delivery guarantee

```sql
create table public.referral_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  referral_credit_id uuid not null unique references public.referral_credits(id) on delete cascade,
  recipient_signup_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending','claimed','sent','suppressed','failed')),
  attempts int not null default 0,
  provider_message_id text,
  provider_accepted_at timestamptz,
  claimed_at timestamptz, sent_at timestamptz, last_error text,
  created_at timestamptz not null default now()
);
```

- Claim RPC uses `FOR UPDATE SKIP LOCKED` plus a 10-minute stale-claim reclaim window.
- **Correction to the previous draft:** it is *not* true that duplicates are impossible. A worker can crash after the provider accepts the message but before `sent` is written; the row is then reclaimed and re-sent.
- Mitigation, in order:
  1. Persist `provider_message_id` / `provider_accepted_at` in a separate short transaction *immediately* after the enqueue call returns, before marking `sent`. A reclaim that finds `provider_accepted_at` already set marks the row `sent` without re-sending.
  2. Pass `referral_credit_id` as the stable idempotency key on the send.
  3. **Verification task (staging, before launch):** enqueue the same key twice and inspect `email_send_log` and the recipient inbox to establish whether the provider deduplicates on that key.
- Documented guarantee depends on that evidence:
  - Provider honours the key → exactly-once delivery for a given credit.
  - Provider does not → **one durable outbox record and at-least-once delivery attempts; a rare duplicate delivery remains possible after a worker crash.** This wording ships in the code comment and the runbook.

## 9. Secure scheduled worker

- Drain endpoint `POST /api/public/hooks/referral-notifications`.
- **The anon/publishable key is not accepted as authentication.** A dedicated private secret (`REFERRAL_JOB_SECRET`, generated and stored server-side, mirrored into Supabase Vault for the cron job) is sent in an `x-job-secret` header and compared server-side with a constant-time comparison. Missing or wrong secret → `401`, no work performed, no information leaked.
- The secret and the service-role key exist only in server-side handler code; neither is imported into any client-reachable module (`client.server` loaded via `await import()` inside the handler).
- `pg_cron` reads the secret from Vault (same pattern as the existing email queue job) — it is never written into a migration file.

## 10. Consent classification and copy

- This email depends on marketing/updates consent and carries an unsubscribe option, so it is classified consistently as a **waitlist/referral update email**, not transactional. It is gated on `consent_to_updates` / `consent_marketing` and on `suppressed_emails`.
- Withdrawn consent or suppression → outbox row `suppressed`; **the credit and the ranking update remain valid.**
- Exact wording: *"Your invite was credited. You now have [count] confirmed invites and are currently #[position]."* No identity, no masked email, no timestamp of the referred person.
- No claim anywhere in copy that a referral moves someone a fixed number of visible places. The internal rule tested is the `priority_score` delta.
- `/privacy` gains a line covering this email type and its unsubscribe path.

## 11. Analytics PII removal (unchanged)

Stop sending `email` / `email_normalized` from `src/lib/prelaunch-analytics.ts`; migration nulls and drops both columns and tightens the anon INSERT policy. No export of deleted values — no retention obligation exists.

## 12. Acceptance tests (staging only — the preview URL shares production data)

1. `?ref=` survives Home → Find a WayMaker → Become a WayMaker; cleared from sessionStorage after successful signup.
2. Malformed codes (wrong length, `I/L/O/0/1`, lowercase) discarded client- and server-side; signup still succeeds.
3. Self-referral and unknown code: no credit; signup succeeds.
4. **Two simultaneous submissions with the same normalized email → exactly one signup row and exactly one pending credit (no duplicate, no second attach).**
5. Repeat submission of an existing email with a *different* `?ref=`: `referred_by` unchanged, no new or modified credit.
6. **An unverified signup does not appear in public waitlist status and does not change anyone else's position.**
7. **After confirmation the signup appears exactly once in the public queue.**
8. Three GETs of the confirmation link (scanner simulation): credit stays `pending`, no outbox row.
9. Explicit POST confirm: credit `awarded`, `referral_count = 1`, `priority_score` delta exactly **−5**.
10. Three confirmed referrals for one referrer: `priority_score` delta exactly **−15**, `referral_count = 3`, three ledger rows, three outbox rows.
11. Repeat POST confirm: no extra credit, no extra outbox row, no extra email.
12. Expired token: POST returns `expired`, no writes.
13. Concurrent confirms of two referrals for one referrer: `referral_count = 2`, no lost update.
14. **Drain endpoint with no secret → 401; with an invalid secret → 401; no rows claimed in either case.**
15. Drain run twice over one outbox row: one `sent` row; provider message id persisted before `sent`.
16. **Provider idempotency evidence recorded** (duplicate key test) — or the delivery guarantee text updated to at-least-once.
17. Referrer with withdrawn consent or suppressed address: credit awarded, score updated, outbox `suppressed`, zero emails queued.
18. Notification body matches the exact approved sentence and reveals no identity.
19. Position ordering deterministic and reproducible; ties resolved by `base_position`.
20. New analytics rows carry no email values; the columns no longer exist.

## 13. Migration scope (exact, in order)

1. `email_normalized` generated column + collision assertion + unique constraint + drop old `lower(email)` index.
2. `referral_credits` table, grants (`service_role` only), RLS, admin read policy.
3. Confirmation-token columns on `early_access_signups` + index on `confirm_token_hash`.
4. `referral_notification_outbox` table, grants, RLS, admin read policy.
5. RPCs — `create_or_get_signup`, `confirm_email_status` (read-only), `confirm_email_and_award`, `claim_referral_notifications`, `mark_referral_notification` — all `SECURITY DEFINER`, `SET search_path = public`, execute revoked from `public`/`anon`/`authenticated`, granted to `service_role`.
6. Analytics: null + drop `email`, `email_normalized`; tighten anon INSERT policy.
7. Vault secret + `pg_cron` schedule for the drain endpoint (data operation, not a migration file).

## 14. Implementation scope (files)

New: `src/lib/referral-code.ts`, `src/lib/confirm-email.functions.ts`, `src/routes/confirm-email.tsx`, `src/routes/api/public/hooks/referral-notifications.ts`, `src/lib/email-templates/referral-credited.tsx`, `src/lib/referral-notify.server.ts`.

Modified: `src/routes/index.tsx`, `src/routes/find-a-waymaker.tsx`, `src/routes/become-a-waymaker.tsx`, `src/components/EmailCapture.tsx`, `src/components/JoinEarlyAccess.tsx`, `src/lib/early-access.functions.ts`, `src/lib/email-templates/registry.ts`, `src/lib/email-templates/waitlist-confirmation.tsx`, `src/lib/prelaunch-analytics.ts`, `src/routes/waitlist.$code.tsx`, `src/routes/privacy.tsx`, `src/lib/mcp/tools/*` (email lookups), `src/lib/admin.functions.ts`.

## 15. Rollback

- Everything is additive except the analytics column drop and the email-index swap (the new unique constraint is equivalent in strength, so reverting it is safe but unnecessary).
- `referral_count` is derived from the ledger, so any bad state is repaired by recomputing from `referral_credits`.
- The verified-only waitlist changes reads, not writes: reverting the app code restores the previous (unverified-inclusive) counting without data loss.
- The analytics column drop is irreversible and intentional.
