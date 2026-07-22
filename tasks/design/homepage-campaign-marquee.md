# UI Design Review

## Pre-Build Review

- Job to be done: create a lively but restrained transition from the dark hero into Nate's story.
- Information hierarchy: the ribbon is a visual bridge, so it should remain shorter and less dominant than either section heading.
- Design-system fit: use campaign teal, dark ink, Lilita One, generous spacing, and the soft tilt shown in the supplied reference.
- Motion purpose: continuous movement reinforces a rallying-cheer motif. Use a linear transform because the movement has no beginning or end.
- Responsive behavior: keep phrases on one line, crop only at the viewport edge, and prevent document-level horizontal overflow.
- Accessibility: expose the phrases once to assistive technology, hide duplicated visual groups, and replace the moving track with a concise static message under reduced motion.

## Risks To Address Before Coding

- A visible jump where the duplicated track restarts.
- Excessive speed or tilt that distracts from the family story.
- A hard seam against the existing curved story transition.
- Repeated phrases being announced twice by screen readers.
- Animation continuing when the user requests reduced motion.

## Post-Build Screenshot Review

Rendered captures were reviewed at 1440 x 1100 and 390 x 844, including a reduced-motion mobile pass.

| Before | After | Why |
| --- | --- | --- |
| The hero ended directly into the next section | A short teal campaign ribbon bridges the two sections | Adds energy without introducing another content-heavy block |
| A flat full-width strip | A one-degree tilt with a restrained border and shadow | Matches the supplied reference and existing campaign personality without becoming noisy |
| A JavaScript or Framer Motion ticker | A linear CSS `transform` loop over two equal-width groups | Predetermined motion stays smooth under load and loops without a visible seam |
| Repeated visual phrases could be announced twice | The duplicated track is hidden from assistive technology and a single summary is exposed | Preserves the visual loop without repeated screen-reader output |
| Continuous movement for every visitor | A compact static campaign line under `prefers-reduced-motion` | Keeps the message while removing position animation |

- Desktop capture: `/tmp/go-nate-go-marquee-desktop-context.png`
- Mobile capture: `/tmp/go-nate-go-marquee-mobile.png`
- Reduced-motion capture: `/tmp/go-nate-go-marquee-mobile-reduced.png`
- The 390px viewport remained exactly 390px wide at the document level.
- Both marquee groups measured 1120px at the mobile viewport, confirming the duplicated loop geometry matches.
- Pointer hover changed the computed animation play state to `paused`.

## Remaining Polish Or UX Issues

None found in this slice.
