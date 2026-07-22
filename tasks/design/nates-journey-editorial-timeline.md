# UI Design Review

## Pre-Build Review

- Job to be done: let visitors scan Nate's chronology quickly, then choose whether to read the full story.
- Hierarchy: eyebrow, large section title, one-sentence introduction, five timeline rows, family quote, compact external-story card.
- Design-system fit: Lilita One for dates, milestone titles, and quote; Work Sans for descriptions and action copy; teal reserved for chronology and emphasis.
- Responsive behavior: use a two-column date/content grid on larger screens and a single-column reading order on mobile.
- Motion purpose: the timeline should stay calm and static so it does not compete with the animated marquee above it.
- Accessibility: use ordered-list semantics for chronology, visible focus treatment for the external link, and meaningful image alt text.

## Risks To Address Before Coding

- Timeline copy becoming so compressed that medical context is lost.
- Dates looking detached from their corresponding milestone on mobile.
- Dividers or type scale making the section feel like a corporate report.
- The quote or bottom action overpowering the chronology.
- Reintroducing generic card styling instead of the reference's editorial rhythm.

## Post-Build Screenshot Review

| Before | After | Why |
| --- | --- | --- |
| Three long, badge-led paragraphs in a narrow column | Five date-led rows with consistent dividers | Makes the chronology understandable at a glance and matches the supplied editorial reference |
| Decorative wave and stacked reveal animation | Direct transition from the marquee into a static section | Gives the story a calmer reading rhythm and avoids competing motion |
| Large full-story card | Compact logo, context, and action row | Keeps the external story available without overpowering Nate's timeline |
| Story categories carry the hierarchy | Dates, milestone titles, and restrained teal emphasis carry the hierarchy | Feels more personal and campaign-specific than a generic feature layout |
| Dates read as separate labels | A thin teal rail and small nodes connect the desktop date column | Adds chronological continuity without adding icons or card-like stepper chrome |

Desktop review confirmed the centered introduction, two-column timeline, family quote, and compact story action reproduce the supplied composition while retaining the campaign palette. Mobile review confirmed the dates stack directly above their milestone copy, the action becomes full width, and the page has no horizontal overflow.

The initial reveal treatment was removed after reduced-motion testing exposed persistent transform offsets during hydration. The final timeline contains no in-section animation, so its content is immediately readable in both motion preferences.

The connection treatment adapts the restrained rail-and-node pattern found in [Mobbin's Wise timeline reference](https://mobbin.com/sites/sections/56d6864d-7fa5-4649-85cd-a2730ff775ce). It stays between the two desktop columns and is intentionally hidden once the layout stacks on mobile. Browser geometry confirmed five visible desktop markers with a maximum segment join gap below one pixel; the responsive check confirmed the markers are hidden and the document does not overflow at the mobile viewport.

## Remaining Polish Or UX Issues

None found in this slice. Local DonorDrive API failures and the existing scroll-container console warning remain environment-specific and were not introduced by this component.
