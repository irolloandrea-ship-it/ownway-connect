# Waitlist confirmation email refinements

Only `src/lib/email-templates/waitlist-confirmation.tsx` (plus a tiny helper) changes. Design, colours, fonts, footer, referral codes, backend and delivery flow stay exactly as they are.

## Referral copy — backend check result

The backend does **not** award one place per referral: each referral reduces the priority score by 5 (`priority_score = base_position - referral_count * 5`). The visible rank is dynamic because it depends on everyone else's score, so the exact "one place higher" promise is not implemented. The neutral copy stays until the referral flow is fully audited.

Therefore the neutral wording will be used:

> Share your invite link with friends who love to travel. Each new friend who joins through your link helps you move up the list.

The current "roughly five places higher" sentence is removed.

## Changes

1. **Primary CTA** — already points at the personal waitlist page (`waitlistUrl` / `/waitlist/<code>`); label and helper text stay as-is. No raw referral URL is rendered anywhere, and none will be added.
2. **Lower waitlist link** — becomes: "You can **manage your waitlist** anytime to check your position or update your details." Only "manage your waitlist" is the link, pointing to the personal waitlist URL.
3. **Email privacy** — the position card shows a masked address instead of the full one, e.g. `Held for an••@ex•••••.com`. Preview text, subject and all other copy contain no email address.

## Technical notes

- New helper `src/lib/email-templates/mask-email.ts` exporting `maskEmail(email)`: keeps the first 2 chars of the local part and the first 2 of the domain label, masks the rest with `•`, preserves the TLD, and degrades gracefully for 1–2 char local parts, missing `@`, subdomains and empty input.
- Remove the now-unused `referralUrl`-derived `share` constant if nothing else uses it; keep the `referralUrl` prop in the interface so the send payload stays unchanged.
- `previewData` uses a realistic recipient so the dashboard preview shows the masked form.

## Verification

- Render the template to HTML with a realistic recipient and grep the output for the full address (must be absent) and for `?ref=` (must be absent).
- Confirm both the CTA `href` and the "manage your waitlist" link resolve to `/waitlist/<code>`.
- Run the type check and report changed files and results.
- Then send one real test email to a controlled address you provide (a live send through the normal waitlist flow) so you can open it in a mobile email app — Gmail and Apple Mail render differently from the template preview. Report the send status; you confirm the visual result on device.
