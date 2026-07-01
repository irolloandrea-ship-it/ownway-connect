## Where signups live

All emails collected from the homepage are stored in your backend database, in the `early_access_signups` table. Each row includes:

- Email, role, destination
- Referral code, who referred them, referral count
- Waitlist position (base_position, priority_score)
- Consent-to-updates flag, source, signup date

## What I'll add

A single **"Download waitlist as CSV"** button in the existing admin panel (`/admin`, behind admin login).

### CSV contents (one row per signup, sorted by waitlist position)

| Column | Source |
|---|---|
| Position | computed from priority_score |
| Email | early_access_signups.email |
| Role | explorer / waymaker / curious / unknown |
| Destination | free-text answer, if provided |
| Referral code | their own share code |
| Referred by | code of the person who invited them |
| Referrals | how many people they've brought in |
| Consent to updates | yes / no |
| Source | UTM / page tag if set |
| Signed up at | ISO timestamp |

### Technical notes

- New authenticated server function `exportWaitlistCsv` in `src/lib/admin.functions.ts`, guarded by `requireSupabaseAuth` + `has_role(admin)`.
- Reads all rows via the service-role client, sorts by `priority_score` then `id`, streams a CSV string back.
- New "Waitlist" tab (or button in existing tabs bar) in `src/routes/admin.tsx` that triggers a browser download of `ownway-waitlist-YYYY-MM-DD.csv`.
- No schema changes, no changes to the public landing page, no email notifications.

You'll be able to re-download an up-to-date CSV any time from the admin panel.
