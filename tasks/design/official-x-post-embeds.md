# UI Design Review

## Pre-Build Review

The primary job is to let visitors recognize and read third-party coverage of Nate without leaving the homepage immediately. X's official rendering should carry its own content hierarchy; the campaign page should provide spacing, loading stability, and a calm failure state rather than visually restyling the Post.

## Risks To Address Before Coding

- Reserve enough height to avoid masonry reflow while X loads.
- Keep the fallback visually aligned with the campaign palette and make the destination explicit.
- Avoid indefinite skeletons when privacy tools block X.
- Do not add decorative motion inside the third-party embed.
- Keep embedded posts within the existing columns on mobile and desktop.
- Preserve keyboard access and visible focus treatment for the fallback link.

## Post-Build Screenshot Review

- Desktop Browser review showed all three Nate posts rendered as official dark-theme X cards within the existing masonry columns.
- X's author, follow, timestamp, engagement, media, and “Read more on X” affordances remain recognizable and are not restyled by the campaign shell.
- The teal campaign label, Lilita heading, and dark section background still lead the section; the embeds read as sourced coverage beneath that hierarchy.
- A narrow responsive pass kept the widget widths inside the single-column content area with no document-level horizontal overflow.
- The loading overlay reserves 440px while leaving the widget target measurable, avoiding both masonry collapse and zero-width official iframes.
- A deliberately missing script URL produced three calm, keyboard-accessible permalink cards without a runtime overlay or stranded loading state.

## Remaining Polish Or UX Issues

Third-party X markup controls its own typography and internal spacing, so exact card height varies by post content. That variation is appropriate for the existing masonry layout and does not require local normalization.
