# Italian homepage with English toggle

## Goal
Make the public homepage open in Italian by default, with a clear `IT / ENG` control that switches all homepage marketing and signup copy between Italian and English.

## Changes
- Add a small accessible language switch to the desktop and mobile header.
- Keep the selected language while navigating or refreshing, without placing personal information in storage.
- Translate the homepage navigation, headline, supplied subtitle, calls to action, “How it works”, example advice, audience sections, FAQ, footer, and early-access dialog.
- Keep the existing English copy available through the switch.
- Preserve the current design, imagery, iPhone journey, analytics behavior, links, and signup logic.
- Update homepage search/social descriptions so the default Italian page is represented accurately.

## Technical details
- Introduce a lightweight homepage language context with Italian as the initial language and browser storage for the user’s explicit selection.
- Pass translated labels into shared homepage elements without changing the copy on separate English content pages.
- Use existing OwnWay buttons and design tokens for the switch and maintain keyboard/screen-reader support.
- Verify Italian and English states at desktop and mobile widths, including the signup dialog.
