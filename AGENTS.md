# Spain travel plan: cloud maintenance

This repository powers the public Spain trip website at:

https://xixi5527.github.io/spain-travel-plan-site/

## Maintenance rules

- Treat `trip-data.json` as the source of truth for flights, hotels, tickets, daily schedules, and preparation items.
- Preserve the mobile-first layout and the Mediterranean film visual direction.
- Do not publish passport numbers, booking references, phone numbers, email addresses, payment details, or other sensitive personal data unless the user explicitly asks for that exact disclosure.
- Hotel names and addresses are approved for the public travel page.
- Do not invent missing bookings, times, transport, or confirmation states. Keep unknown facts marked as pending.
- Preserve all 12 days from 2026-09-30 through 2026-10-11 and the group size of 5 adults plus 1 child unless the user provides an update.

## Before publishing

1. Run `node scripts/validate-cloud.mjs`.
2. Review the diff for accidental private information.
3. Commit the change on a task branch and open a pull request to `main`.
4. Merge only after validation succeeds. Then wait for GitHub Pages to finish and verify the public URL loads.

For small itinerary updates, prefer changing only `trip-data.json`. Update HTML, CSS, or JavaScript only when the requested presentation or behavior requires it.
