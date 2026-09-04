# Context

## Requested Framing
Audit Go Nate Go for useless tests, unnecessary wrappers, and other code that adds maintenance without value.

## Actual User Pain
Abandoned features and duplicated scaffolding obscure the code that runs the fundraiser.

## Rejected Framing
Deleting tests or abstractions solely because they are small or look generated.

## Narrowest Wedge
Remove proven unused campaign code, the duplicate toast implementation, and redundant fundraising aliases. Strengthen one misleading polling assertion.

## Non-Goals
No redesign, donation/API contract changes, deployment, or broad removal of the shared shadcn component catalog. Preserve existing dirty files and personal media.

## Success Metric
Every deletion has import/caller evidence; lint, strict TypeScript, production build, and all existing regression tests pass.

## Why Now
The birthday RSVP has closed, leaving its countdown and email implementation unreachable.

## Assumptions And Open Questions
Scope is the current repository. Unused reusable library components and potentially historical external API consumers require separate consideration.
