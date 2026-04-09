# UI Design Review

## Pre-Build Review

- The new countdown should feel more theatrical than the previous inline pills without overwhelming the closing signature.
- The user specifically wants a split-flap look, so the countdown must read as a purpose-built board rather than generic stat chips.
- The hourly chaos effect should feel surprising and playful, but it still needs to resolve back to a legible time quickly.
- Tailwind 4 and `motion/react` are part of the requested implementation direction, so the design slice includes that stack migration rather than treating it as unrelated maintenance.

## Risks To Address Before Coding

- Upgrading Tailwind could regress existing semantic token usage if the v3 theme mapping is not preserved in CSS.
- A flipboard that is too tall or too bright would compete with the signature card.
- Captured screenshots may land mid-second-flip; review should account for live motion rather than assuming every screenshot shows a settled state.
- Reduced-motion behavior must avoid constant 3D flap motion.

## Post-Build Screenshot Review

- Verified on local `/birthday` render using `agent-browser`.
- The page shell still renders correctly after the Tailwind 4 migration.
- The new board sits beneath the signature and establishes a stronger focal element than the prior inline countdown.
- The board remains visually aligned with the campaign palette through the deep blue shell and pale split-flap tiles.
- Smoke-test screenshots captured the board mid-second transition, which is expected for a live clock.

## Remaining Polish Or UX Issues

- If the user wants even more dramatic hourly chaos, the next pass should tune that motion specifically rather than enlarging the board further.
