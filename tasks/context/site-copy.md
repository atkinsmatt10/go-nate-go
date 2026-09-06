# Context

## Requested Framing
Make every word in the site text justify its existence.

## Actual User Pain
Repeated mission statements, generic encouragement, and verbose instructions dilute Nate's story and make actions harder to scan.

## Rejected Framing
Minimizing word count at the expense of warmth, factual detail, or useful payment guidance.

## Narrowest Wedge
Edit owned page copy, metadata, and supporting UI messages in place.

## Non-Goals
No redesign, payment/data-flow changes, external post edits, or revised medical facts. The user approved production shipment of the copy while explicitly excluding the Three.js experiment. Preserve that experiment in the original checkout.

## Success Metric
Each section adds information; labels explain their destination or action; dates, medical details, payment states, and accessibility remain clear. Lint, type checks, build, and relevant browser checks pass.

## Why Now
The user requested an editorial pass on the current site.

## Assumptions And Open Questions
Scope includes homepage, donation/return, birthday archive, 404, and metadata. Existing factual claims are the source of truth; no new factual claims are introduced. Receipt email will be reviewed but is outside site-page editing.

The production release starts from clean `origin/main` and includes only the approved copy, matching regression assertions, and task records. The hero retains its original SVG artwork, CSS animation, and spacing. Exclude Three.js source files, CSS, dependencies, and experimental previews.
