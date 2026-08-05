# Mobile-friendly invite sharing

Make the confirmation email point people to their personal waitlist page, and make that page the place where sharing actually happens — native share sheet on phones, copy-link fallback everywhere else.

## 1. Confirmation email

In the waitlist confirmation email, keep the current layout, palette, and copy structure. Only the "Move up the list" block changes:

- CTA label becomes "Share your OwnWay invite".
- CTA links to the personal waitlist page (`/waitlist/<code>`) instead of the referral URL.
- The large exposed referral URL under the button is removed.
- Helper text under the CTA: "Open your invite page to share or copy your personal link."
- The footer "Manage your waitlist" link and privacy link stay as they are.

No JavaScript is added to the email.

## 2. Personal waitlist page

In the referral section of `/waitlist/<code>`:

- Add a prominent primary button: "Share your OwnWay invite".
- On tap/click it opens the device share sheet with title "OwnWay", text "I'm on the OwnWay early-access list. Join through my invite link:", and the person's exact existing referral URL.
- Cancelling the share sheet is silent — no error, no toast.

Fallback when the device has no native sharing:

- Secondary button "Copy invite link" copies the exact referral URL.
- On success the label switches to "Link copied" for a moment, and a screen-reader-friendly live message announces "Invite link copied to clipboard."
- If the clipboard is blocked, a selectable read-only field with the URL appears with the instruction "Copy this link to share it."

The referral URL itself stays on the page as a small, secondary fallback element rather than the main focus.

## What stays exactly the same

Routes, referral codes, referral counting and attribution, waitlist position maths, stored data, permissions, and email delivery. No database migration.

## Technical notes

- `src/lib/email-templates/waitlist-confirmation.tsx`: repoint `Button href` to the `waitlistUrl` prop (already passed and already defaulted to `${siteUrl}/waitlist/${referralCode}`), change the label, drop the `linkBlock` referral URL paragraph, add the helper line.
- `src/routes/waitlist.$code.tsx`: replace the current input + "Copy" row with the new share/copy UI. Detect support with `typeof navigator !== "undefined" && !!navigator.share` inside an effect (avoids SSR/hydration mismatch); call `navigator.share` inside the click handler and swallow `AbortError`. Clipboard write wrapped in try/catch, falling back to a `readOnly` input plus instruction. `aria-live="polite"` region for copy feedback; native `<button>` elements via the existing `Button` component keep keyboard and focus-ring behaviour.
- `shareUrl` derivation and all server-function calls stay untouched.
- Verify with a type check and confirm mobile/desktop behaviour in the preview before reporting done.
