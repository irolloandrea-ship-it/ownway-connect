# Referral flow hardening — revised implementation plan

Goal unchanged: one genuinely new, verified signup arriving via a valid invite link creates exactly one durable referral credit, atomically improves the referrer's priority, and triggers exactly one privacy-safe notification to the referrer.

Nothing changes until this plan is approved. Existing routes, invite URLs (`/?ref=CODE`, `/waitlist/CODE`), consent records and production rows stay intact.

Verified before writing this revision: production `early_access_signups` holds 15 rows, **0** with a `referred_by` value and **0** with `referral_count > 0`. There is no referral history to backfill.

---

## 1. Invite-code persistence — session only

- New `src/lib/referral-code.ts`. `?ref=` is captured into **sessionStorage only**; first-touch wins within the session. No localStorage, no 30-day window (can be added later only on your explicit approval).
- The stored code is cleared immediately after a successful signup submission.
- Client-side format check matches the existing generator exactly: 7 characters from the alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (`^[A-HJ-NP-Z2-9]{7}$`, uppercase, excludes I/L/O/0/1). Anything else is discarded on capture.
- Capture runs on mount for `/`, `/find-a-waymaker`, `/become-a-waymaker`; `EmailCapture` and `JoinEarlyAccess` read from the store rather than depending on a prop that only Home passes.
- Server re-validates: `submitEarlyAccess` looks the code up in `early_access_signups`. Unknown code, or the signing-up email's own code, is silently dropped (`referred_by = null`) — never surfaced as an error.

## 2. `referral_credits` ledger

```sql
create table public.referral_credits (
  id uuid primary key default gen_random_uuid(),
  referrer_signup_id uuid not null references public.early_access_signups(id) on delete cascade,
  referred_signup_id uuid not null unique
    references public.early_access_signups(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','awarded','void')),
  created_at timestamptz not null default now(),
  awarded_at timestamptz
);
create index on public.referral_credits (referrer_signup_id) where status = 'awarded';
```

- `referred_signup_id` is the sole uniqueness key — one credit per new signup. `referred_email_normalized` is **not** duplicated here; the email already lives on the referenced signup row and there is no retention or legal reason to copy it.
- One-credit-per-email is still enforced, because `submitEarlyAccess` reuses the existing signup row for a repeat email (existing `ilike` lookup), so a second submission cannot produce a second `referred_signup_id`.
- Permissions: `GRANT ALL ... TO service_role` only; no `anon`/`authenticated` grants. RLS enabled with a single admin read policy `using (public.is_admin())` so the admin views can audit.

Backfill: none. Production has zero referred rows, so no historical credits are inferred or created.

## 3. Scanner-safe email confirmation

Email scanners and link prefetchers follow GET links, so confirmation cannot be a GET side effect.

- New columns on `early_access_signups`: `email_verified_at timestamptz`, `confirm_token_hash text`, `confirm_token_expires_at timestamptz`, `confirm_token_used_at timestamptz`. Only the **SHA-256 hash** of the token is stored; the raw token exists only in the email link. Expiry: 14 days, single use.
- The waitlist confirmation email gains a "Confirm your email" link to `/confirm-email?t=<raw token>`.
- `GET /confirm-email` is a pure render: it calls a read-only server function that hashes the token and reports one of `valid` / `expired` / `already_used` / `invalid`. No writes, no state change.
- The page then requires an explicit user action ("Confirm my email" button) which issues a **POST** server function that performs verification and credit award.
- Repeat clicks and repeat POSTs are idempotent no-ops: the second POST finds `confirm_token_used_at` set (or `status <> 'pending'`) and returns success without creating anything.

## 4. Award transaction — exact boundaries

Single `SECURITY DEFINER` RPC, one transaction, `SET search_path = public`, `REVOKE EXECUTE FROM PUBLIC, anon, authenticated` and `GRANT EXECUTE TO service_role`:

```
confirm_email_and_award(p_token_hash text) returns table(
  outcome text, credit_id uuid, referrer_signup_id uuid,
  awarded_referrals int, queue_score int
)
```

Transaction body, in order:
1. `SELECT ... FROM early_access_signups WHERE confirm_token_hash = p_token_hash FOR UPDATE`. Not found / expired / already used → return `outcome` and stop (no writes).
2. Set `email_verified_at = now()`, `confirm_token_used_at = now()` on that row.
3. `UPDATE referral_credits SET status='awarded', awarded_at=now() WHERE referred_signup_id = <row.id> AND status='pending' RETURNING id`. Zero rows → verification succeeds, no credit, done.
4. Lock the referrer: `SELECT ... FROM early_access_signups WHERE id = referrer_signup_id FOR UPDATE` (ordered lock acquisition avoids deadlocks with concurrent awards on the same referrer).
5. Recompute derived count: `awarded := (select count(*) from referral_credits where referrer_signup_id = r and status='awarded')` and `UPDATE early_access_signups SET referral_count = awarded WHERE id = r`. The existing `early_access_before_update` trigger recomputes `priority_score = base_position - (referral_count * 5)` — **the five-point rule is preserved verbatim**.
6. `INSERT INTO referral_notification_outbox (referral_credit_id, ...) ON CONFLICT DO NOTHING` — same transaction, so the outbox row and the awarded credit commit together or not at all.

Retries and concurrency: the credit award is a conditional `UPDATE ... WHERE status='pending'` guarded by a row lock, so exactly one transaction can flip it; the count is derived rather than incremented, so no update can lose a credit.

## 5. Durable notification outbox

```sql
create table public.referral_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  referral_credit_id uuid not null unique
    references public.referral_credits(id) on delete cascade,
  recipient_signup_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending','claimed','sent','suppressed','failed')),
  attempts int not null default 0,
  claimed_at timestamptz, sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);
```

- `service_role` grants only, RLS on, admin read policy.
- Claim RPC `claim_referral_notifications(p_limit int)`: `UPDATE ... SET status='claimed', claimed_at=now(), attempts=attempts+1 WHERE id IN (SELECT id FROM ... WHERE status='pending' OR (status='claimed' AND claimed_at < now() - interval '10 minutes') ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT p_limit) RETURNING ...`. `SKIP LOCKED` guarantees a row is handed to exactly one worker; the stale-claim window makes crashed workers recoverable without duplicating a `sent` row.
- A server route `POST /api/public/hooks/referral-notifications` (anon `apikey` header, driven by `pg_cron` every minute) drains claimed rows: renders and enqueues the email, then marks `sent`. `sent` rows are never re-claimed, so duplicates are impossible independent of `sendTransactionalEmailInternal`'s idempotency key (which we still pass, as belt-and-braces, keyed on `referral_credit_id`).
- Failures increment `attempts`, record `last_error`, and revert to `pending` until 5 attempts, then `failed` for admin review.

## 6. Consent and suppression

- Before sending, the processor checks the referrer's `consent_to_updates`/`consent_marketing` and the shared `suppressed_emails` table. If consent is withdrawn or the address is suppressed, the outbox row is marked `suppressed` — not `failed` — and no email is queued.
- **Crediting is unaffected**: the credit and score update already committed in step 4; suppression only stops the notification.
- Classification: this is a transactional account notification about the recipient's own waitlist standing, so it goes through the app-email pipeline with the standard unsubscribe footer, and an unsubscribe here suppresses future referral notifications too.
- Privacy page update: add referral notifications to the list of emails we send and state that invite counts are aggregate only.

## 7. Referrer notification content

New template `src/lib/email-templates/referrer-credit.tsx`, registered in `registry.ts`, styled like the waitlist confirmation.

- Headline: "Someone joined through your invite." No name, no email, no masked email, no timestamp precise enough to identify the referred person.
- Shows the referrer's updated invite count and current waitlist position, plus a CTA to their own `/waitlist/<code>` page.

## 8. Deterministic position

`computePosition` currently ties on `id` (UUID). Change the tiebreaker to `base_position`, falling back to `created_at` when `base_position` is null. Applied consistently in `getWaitlistStatus`, the notification payload and admin views.

## 9. Analytics PII removal

- `src/lib/prelaunch-analytics.ts` stops sending `email` / `email_normalized`; everything else (event name, path, UTM, source, button metadata) is retained.
- Migration nulls then drops both columns and tightens the anon INSERT policy so they cannot return.
- **No export of the deleted values** — there is no documented retention obligation, and preserving them would defeat the purpose.

## 10. Test strategy — staging only

The preview URL shares the production database and is not a test environment. All tests run against a genuinely separate staging backend with migrations applied and synthetic signups seeded. Production gets the migrations only after staging passes, followed by one controlled internal invite.

Acceptance tests:
1. `?ref=` captured on Home survives navigation to Find a WayMaker and Become a WayMaker; the code is gone from sessionStorage after a successful signup.
2. Malformed codes (wrong length, `I`/`L`/`O`/`0`/`1`, lowercase junk) are discarded client-side and server-side; signup still succeeds.
3. Self-referral and unknown code produce no credit; signup still succeeds.
4. GET of the confirmation link three times (simulating a scanner) leaves `referral_credits.status = 'pending'` and creates no outbox row.
5. Explicit POST confirm: credit becomes `awarded`, `referral_count = 1`, and `priority_score` changes by exactly **−5**.
6. Three distinct confirmed referrals for one referrer: `priority_score` changes by exactly **−15**, `referral_count = 3`, three ledger rows, three outbox rows.
7. Repeat POST confirm and repeat GET: no additional credit, no additional outbox row, no extra email.
8. Expired token: POST returns `expired`, no writes.
9. Concurrent confirms for two referrals of the same referrer: final `referral_count = 2`, no lost update.
10. Queue processor run twice over the same outbox row: exactly one send.
11. Referrer with withdrawn consent or a suppressed address: credit awarded and score updated, outbox row `suppressed`, zero emails queued.
12. Notification email contains no referred-person identity.
13. Position ordering stable and reproducible across repeated reads.
14. New analytics rows contain no email values; the columns no longer exist.

## Rollback

- All schema is additive except the analytics column drop. Reverting app code alone restores prior behaviour; the ledger and outbox simply stop receiving rows.
- `referral_count` is derived from the ledger, so a bad state is repaired by recomputing counts from `referral_credits`, not by manual arithmetic.
- The analytics column drop is irreversible and intentional.

## Technical inventory

**Migrations**
1. `referral_credits` + grants + RLS + admin policy (no backfill).
2. Confirmation-token columns on `early_access_signups` (`email_verified_at`, `confirm_token_hash`, `confirm_token_expires_at`, `confirm_token_used_at`) + index on hash.
3. `referral_notification_outbox` + grants + RLS + admin policy.
4. RPCs `confirm_email_and_award`, `claim_referral_notifications`, `mark_referral_notification` — all `SECURITY DEFINER`, `SET search_path = public`, execute revoked from `public`/`anon`/`authenticated`, granted to `service_role`.
5. Analytics email column removal + policy tightening.
6. `pg_cron` schedule for the notification drain endpoint.

**Files**: `src/lib/referral-code.ts` (new), `src/routes/index.tsx`, `src/routes/find-a-waymaker.tsx`, `src/routes/become-a-waymaker.tsx`, `src/components/EmailCapture.tsx`, `src/components/JoinEarlyAccess.tsx`, `src/lib/early-access.functions.ts`, `src/lib/confirm-email.functions.ts` (new), `src/routes/confirm-email.tsx` (new), `src/routes/api/public/hooks/referral-notifications.ts` (new), `src/lib/email-templates/referrer-credit.tsx` (new), `src/lib/email-templates/registry.ts`, `src/lib/email-templates/waitlist-confirmation.tsx`, `src/lib/prelaunch-analytics.ts`, `src/routes/privacy.tsx`.
