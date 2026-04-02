# View Transition Animation Slice Architecture

## Architecture summary
- Enable Next.js view transitions for route navigation.
- Add shared transition CSS primitives to the global stylesheet and keep them narrowly targeted.
- Wrap the homepage and donate page in page-level `ViewTransition` boundaries keyed to `nav-forward` and `nav-back`.
- Add a shared logo transition between home and donate.
- Wrap donate checkout panel states and social embed Suspense states in local `ViewTransition` boundaries.

## Slice boundary and dependency impact
- In scope:
- `next.config.mjs`
- `app/globals.css`
- `app/page.tsx`
- `components/hero-section.tsx`
- `app/donate/page.tsx`
- `components/sharing-nates-story.tsx`
- `tasks/**` artifacts for this slice
- Out of scope:
- `app/api/**`
- checkout return handling
- merchandise carousel logic
- unrelated UI cleanup

## Data flow
```text
home CTA click
  -> Link navigation tagged with nav-forward
    -> page-level ViewTransition animates route change
      -> shared logo morph preserves identity

donation amount/email state changes
  -> checkout panel conditionally swaps placeholder/loading/ready UI
    -> state-level ViewTransition animates enter/exit

social embed Suspense resolves
  -> fallback unmounts
    -> embed content mounts inside ViewTransition
      -> reveal animation communicates "data loaded"
```

## State transitions
- Home -> donate:
- `transitionTypes=["nav-forward"]` on CTA links
- page boundary uses directional nav classes
- shared logo uses one `name`
- Donate -> home:
- `transitionTypes=["nav-back"]` on back link
- same page boundary classes reversed by type
- Donate checkout panel:
- placeholder -> loading -> ready states animate in place
- reset path animates back to editable placeholder state
- Social embeds:
- skeleton exits downward
- loaded embed enters upward

## Trust boundaries
- View transitions only affect presentation and navigation continuity.
- Stripe session creation and confirmation behavior stays unchanged.
- Async third-party embeds remain third-party content; the patch only changes how fallback and resolved UI are revealed.

## Edge cases and failure modes
- Unsupported browsers should fall back without breaking layout or interaction.
- Route transitions must not animate every random update, so page boundaries need `default="none"`.
- Shared element names must stay globally unique.
- Donate page frosted surfaces should be isolated from page snapshots where needed to avoid blur artifacts.
- Suspense wrappers must keep stable layout height so reveal motion does not create jumpy masonry columns.

## Test matrix
- Homepage Donate CTA transitions into the donate page.
- Donate page Back Home transitions back to the homepage.
- Shared logo morph occurs between home and donate without duplicate-name errors.
- Donate panel placeholder/loading/ready states animate and still preserve checkout behavior.
- Social embed fallbacks reveal into loaded embeds without layout breakage.
- Reduced-motion users still get usable, non-jarring behavior.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.

## Rollout, rollback, and observability notes
- Rollout is a normal preview build.
- Rollback is a simple revert of this frontend slice.
- If route transitions show blur artifacts, the likely rollback target is the persistent-element CSS and donate-page isolation styles rather than the whole patch.
