# Referral flow hardening — implementation plan

Goal: one genuinely new, verified signup arriving via a valid invite link creates exactly one durable referral credit, atomically improves the referrer's priority, and triggers exactly one privacy-safe notification to the referrer.

No code, data, or emails change until this plan is approved. Existing routes, invite URLs (`/?ref=CODE`, `/waitlist/CODE`), consent records and production rows stay intact.

---

## 1. Persist the invite code until signup

Today `?ref=` is only read from the Home route's search params, so a visitor who lands on Home with an invite and then navigates to Find a WayMaker or Become a WayMaker loses attribution.

- New `src/lib/referral-code.ts`: capture `?ref=` once per browser (session + local storage, same pattern as `prelaunch-analytics.ts`), first-touch wins, expire after 30 days, normalise to uppercase, reject anything not matching `^[A-Z0-9]{4,64}$`.
- Call the capture on mount in `src/routes/index.tsx`, `src/routes/find-a-waymaker.tsx`, `src/routes/become-a-waymaker.tsx`; `EmailCapture` and `JoinEarlyAccess` read the stored code instead of relying on a prop only Home passes.
- Server is the source of truth: `submitEarlyAccess` looks the code up in `early_access_signups`. Unknown code, or code equal to the signing-up email's own code, is silently discarded (stored as `referred_by = null`) — never an error shown to the user.

## 2. Referral credit ledger + atomic RPC

Replace the read-modify-write on `referral_count` (untraceable, lossy under concurrency).

New table `public.referral_credits`:

| column | purpose |
| --- | --- |
| `referrer_signup_id` | who earns the credit |
| `referred_signup_id` | unique — one credit per new signup |
| `referred_email_normalized` | unique — one credit per email, ever |
| `status` | `pending` / `awarded` |
| `awarded_at`, `created_at` | audit trail |

Grants: `service_role` only (no anon/authenticated access — the ledger is written exclusively by server functions). RLS enabled, admin-read policy via `is_admin()`.

New `SECURITY DEFINER` RPC `award_referral_credit(p_referrer_id uuid, p_referred_id uuid, p_referred_email text)`:
1. `INSERT ... ON CONFLICT DO NOTHING` into the ledger.
2. If no row was inserted → return `credited = false` (idempotent no-op, safe for retries).
3. Otherwise recompute the referrer's `referral_count` as `SELECT count(*) FROM referral_credits WHERE referrer_signup_id = ... AND status = 'awarded'` (derived, never incremented) and `UPDATE` the signup row inside the same transaction; the existing `early_access_before_update` trigger recomputes `priority_score`.
4. Return `credited`, new count, and the referrer's email.

Because the count is derived and the insert is guarded by unique constraints, retries and concurrent signups can neither duplicate nor lose credits.

Backfill migration: seed the ledger from existing rows that carry `referred_by`, so current `referral_count` values remain consistent and reproducible.

## 3. Anti-abuse: verify the email before crediting

Smallest measure that meaningfully works, without weakening the current one-click waitlist flow:

- The signup itself is unchanged — the user still joins instantly, sees their position, and receives the confirmation email.
- The credit is created as `pending` at signup and flipped to `awarded` the first time the new signup **clicks a link in their confirmation email** (the existing waitlist-confirmation CTA gains a one-time `?c=<token>` confirm token). No extra screen, no extra step: the same email they already receive does the verification.
- Only `awarded` credits count toward `referral_count` and priority.
- Unique index on `referred_email_normalized` also blocks the same address from being credited twice across re-submissions.

## 4. Deterministic position

`computePosition` currently breaks ties on `id` (UUID — arbitrary). Change the tiebreaker to `base_position` (assigned by sequence at insert, already monotonic), falling back to `created_at`. Same change applied in the RPC and in `getWaitlistStatus`, so email, waitlist page and admin views agree.

## 5. Referrer notification email

New template `src/lib/email-templates/referrer-credit.tsx`, registered in `registry.ts`, styled like the existing waitlist confirmation.

- Copy: "Someone joined through your invite." No name, no email, no masked email of the referred person.
- Shows the referrer's updated invite count and current waitlist position, plus a CTA to their own `/waitlist/<code>` page.
- Sent from `submitEarlyAccess`/confirm handler **after** the RPC reports `credited = true`, via `sendTransactionalEmailInternal`, with `idempotencyKey = referral-credit-<referral_credits.id>` so retries dedupe at the queue.
- Email failures are caught and logged; they never roll back the credit.

## 6. Analytics PII removal

`prelaunch_analytics_events` stores raw `email` and `email_normalized`.

- Stop sending them from `src/lib/prelaunch-analytics.ts` (drop the `email` field from `trackPrelaunchEvent`; keep `event_name`, path, UTM, source, button metadata).
- Migration: null out both columns on existing rows, drop them, and tighten the anon INSERT policy so the columns can't come back.
- `email_signup` events remain countable — the signup row itself is the identified record.

## 7. Test strategy

The preview URL shares the production database, so it is not a test environment.

- Provision a separate staging backend, apply all migrations there, seed synthetic signups, and run the acceptance tests below against it.
- Only after staging passes: apply migrations to production during low traffic, then verify with a single controlled invite using an internal address.

Acceptance tests (staging):
1. Invite link on Home → navigate to Find a WayMaker → sign up: credit is attributed.
2. Same email submits twice: exactly one ledger row, count unchanged on second attempt.
3. Two concurrent signups under one referrer: count increases by exactly 2.
4. Self-referral and unknown code: no credit, signup still succeeds.
5. Unverified signup: credit stays `pending`, priority unchanged; after confirm click it becomes `awarded` and priority improves by 5.
6. Confirm link clicked twice: one credit, one notification email.
7. Notification email contains no referred-person identity.
8. Position ordering stable across repeated reads.
9. New analytics rows contain no email values.

## Rollback

- Ledger and RPC are additive; `referral_count` and `priority_score` keep their current meaning, so reverting app code alone restores prior behaviour.
- Ledger is reconstructible from `referred_by`, so a bad state can be rebuilt by recomputing counts from the ledger.
- The analytics column drop is destructive — take an export of those two columns before the migration if that data has any retention value; otherwise the drop is the intended privacy outcome.

## Technical inventory

Files: `src/lib/referral-code.ts` (new), `src/routes/index.tsx`, `src/routes/find-a-waymaker.tsx`, `src/routes/become-a-waymaker.tsx`, `src/components/EmailCapture.tsx`, `src/components/JoinEarlyAccess.tsx`, `src/lib/early-access.functions.ts`, `src/lib/prelaunch-analytics.ts`, `src/lib/email-templates/referrer-credit.tsx` (new), `src/lib/email-templates/registry.ts`, `src/lib/email-templates/waitlist-confirmation.tsx`, `src/routes/waitlist.$code.tsx`.

Migrations: (1) `referral_credits` table + grants + RLS + backfill; (2) `award_referral_credit` and `confirm_referral_credit` RPCs; (3) confirm-token column on `early_access_signups`; (4) analytics email column removal + policy update.

Server functions: `submitEarlyAccess` (validate code server-side, create pending credit), new `confirmSignupEmail` (awards credit, sends notification), `getWaitlistStatus` (tiebreaker fix).
