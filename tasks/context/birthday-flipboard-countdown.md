# Birthday Flipboard Countdown

## Actual User Pain

The current birthday countdown is too lightweight and no longer feels like the expressive flipboard countdown reference the user wants. The user wants a more theatrical split-flap clock with days, hours, minutes, and seconds, plus a special hourly chaos spin that briefly scrambles with colorful motion before resolving back to the correct time.

## Requested Framing

Adapt the provided React split-flap board concept into this repo and use it for the `/birthday` countdown.

## Rejected Framing

- Do not upgrade the whole repo to Tailwind 4 just to match the pasted snippet.
- Do not introduce a generic message-board demo as the primary shipped behavior if the user need is the countdown itself.
- Do not replace the birthday page layout or signature section outside the countdown slice.

## Narrowest Wedge

Build one reusable flipboard foundation component in `components/ui`, add a countdown-specific wrapper for days/hours/minutes/seconds with hourly chaos mode, and replace the current birthday countdown UI with that wrapper.

## Non-Goals

- No donation flow changes.
- No site-wide design system rewrite.
- No production deployment in this slice.
- No Tailwind major-version migration.

## Success Metric

The `/birthday` page shows a split-flap countdown under the signature, updates every second, and performs a visibly more dramatic all-board scramble when the remaining hour bucket changes.

## Why Now

The user has a specific visual target and already called out the current countdown as not matching it.

## Open Assumptions Or Decisions

- The project keeps its current Tailwind 3 + `framer-motion` stack.
- The default shadcn/ui path remains `@/components/ui`, so new reusable UI belongs there.
- The hourly chaos effect should be stronger than normal second-by-second flips but still settle quickly enough to keep the time readable.
