# Context

## Requested Framing

Update the homepage Nate's Journey section to resemble the supplied editorial timeline reference.

## Actual User Pain

The current section is a long sequence of labeled paragraphs inside a narrow column. It makes Nate's chronology harder to scan and feels less personal than the surrounding campaign experience.

## Rejected Framing

- A generic vertical stepper with dots, icons, or connector lines.
- Five independent feature cards.
- A rewrite that invents or materially changes Nate's medical history.
- A broader homepage redesign.

## Narrowest Wedge

Reshape the existing `NatesStory` component into a five-row editorial timeline with a concise introduction, family quote, and compact full-story link. Preserve the established section background, typography, external URL, and reduced-motion behavior.

## Non-Goals

- No changes to the hero, marquee, fundraising progress, or merchandise sections.
- No new data source, API, or animation dependency.
- No changes to donation behavior.
- No claim that is not supported by the existing repo copy or supplied reference.

## Success Metric

Visitors can understand the sequence of Nate's story at a glance, the full section remains readable at desktop and mobile widths, and the external story action remains obvious without dominating the timeline.

## Why Now

The new marquee creates a stronger transition into the story, and the supplied reference defines a clearer section hierarchy that can carry that momentum forward.

## Assumptions And Open Questions

- The reference's five milestones and family quote are the intended structure.
- The existing Pediatric Brain Tumor Foundation URL remains the destination for the full story.
- This is a one-component presentational change with no contract or state impact, so a separate architecture artifact is unnecessary.
