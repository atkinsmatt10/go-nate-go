# Next.js 16.2 Upgrade

## Actual user pain
- The project is on Next.js 16.1.6 and needs to be brought up to the 16.2 release line.
- The change needs to stay small and low-risk so the fundraising site remains stable.

## Requested framing
- Update this project to Next.js 16.2.

## Rejected framing
- Do not treat this as a broad dependency refresh.
- Do not redesign UI, donation flow, or server behavior as part of the upgrade.
- Do not mix in unrelated cleanup or refactors.

## Narrowest wedge
- Bump `next` and `eslint-config-next` to the current 16.2.x release.
- Refresh the lockfile and verify lint and TypeScript still pass.

## Non-goals
- No React major or minor upgrade unless required by Next 16.2 compatibility.
- No route, component, API, or config refactor unless validation exposes a concrete blocker.

## Success metric
- The repo installs against Next.js 16.2.x and passes the standard verification commands without functional code changes.

## Why now
- Staying current on the active Next 16 line reduces drift and surfaces compatibility issues while the scope is still small.

## Open assumptions or decisions
- Assume `16.2.1` is the correct current 16.2 patch target for both `next` and `eslint-config-next`.
- Assume React 19.2.0 remains compatible and does not need to move for this slice.
