# UI Design Review

## Pre-Build Review

- Job to be done: understand the fundraiser's momentum and reach the donation flow without interpreting a generic status widget.
- Hierarchy: teal eyebrow, large Lilita headline, restrained mission copy, oversized teal amount, goal context, shark-led progress, supporter pill, primary action.
- Library choice: NumberFlow for digit transitions; existing Framer Motion for the progress fill and shark position.
- Responsive behavior: the amount and goal context sit together on wide screens and stack on small screens; the track and labels retain full width.
- Loading/error behavior: recent values stay stable; an understated line discloses when the live total is unavailable.
- Accessibility: semantic progressbar values, accessible NumberFlow output, decorative shark hidden from assistive technology, and visible CTA focus.
- Motion purpose: the digits, fill, and shark communicate fundraising progress once; no looping animation or gratuitous bounce.
- Design-system fit: Lilita One for emphasis, Work Sans for explanatory text, teal reserved for the total/progress/action, deep campaign blue background, soft borders and shadow.

## Risks To Address Before Coding

- The oversized number overwhelming the mission copy or wrapping awkwardly on mobile.
- The shark looking pasted onto the bar instead of anchored to progress.
- Progress stripes becoming visually noisy or corporate.
- Loading/error labels competing with the donation action.
- Number and bar timing falling out of sync.
- Recreating NumberFlow behavior with manual state or animation loops.

## Post-Build Screenshot Review

| Before | After | Why |
| --- | --- | --- |
| Generic “Help Us Reach Our Goal” utility heading | Campaign eyebrow and “Every Dollar Is a Cheer” Lilita headline | Carries the personal campaign voice into the primary donation moment |
| Standard component progress bar with labels beneath | Striped teal track with the campaign shark anchored to the live percentage | Makes progress immediately legible and distinctive without adding a chart |
| Manually animated inline amount | Oversized NumberFlow total paired with concise goal context | Gives the most important fact clear hierarchy and proper digit transitions |
| Small generic badge and CTA | Supporter pill, restrained stale-data disclosure, and buoyant campaign CTA | Preserves trust states while making the next action obvious |

Desktop screenshot review confirmed the section matches the supplied hierarchy: centered campaign introduction, oversized amount and goal, shark-led track, endpoint labels, supporter pill, and donation action. At the fallback values, the rendered fill measured 580px of an 896px track and the semantic values reported `$16,250 raised of $25,000`.

Responsive geometry confirmed every major element stays within the 433px browser viewport: the headline and track use 401px content width, the amount uses 240px, the CTA spans 218px, and document width equals viewport width. The animation check measured progress moving from 21.9% early in the transition to 64.8% at rest. Reduced-motion emulation rendered the final 64.8% immediately with accessible labels for `$16,250 raised` and `62 donations`.

## Remaining Polish Or UX Issues

The local DonorDrive endpoint currently returns `404`, so browser QA covered the explicit recent-value fallback and stale-data disclosure. The live success branch retains the existing typed SWR contract and refresh behavior but could not be exercised against the upstream service locally.
