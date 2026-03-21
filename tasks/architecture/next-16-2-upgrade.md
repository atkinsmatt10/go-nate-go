# Next.js 16.2 Upgrade Architecture

## Architecture summary
- Keep the slice at the dependency boundary.
- Update the Next runtime and lint config package, then validate the existing App Router codebase against the new version.

## Slice boundary and dependency impact
- In scope:
- `package.json`
- `pnpm-lock.yaml`
- `tasks/todo.md`
- workflow artifacts for this slice
- Out of scope:
- application route code
- checkout and donation APIs
- homepage presentation work
- unrelated package upgrades

## Data flow
```text
package.json dependency range update
  -> pnpm lockfile refresh
    -> lint and TypeScript run against installed Next 16.2 toolchain
      -> fix only concrete regressions introduced by the version bump
```

## State transitions
- Before: repo resolves `next@16.1.6` and `eslint-config-next@16.1.6`.
- After: repo resolves `next@16.2.1` and `eslint-config-next@16.2.1`.

## Trust boundaries
- Application behavior should remain unchanged because this slice only changes framework packages.
- Verification must prove the current code still satisfies lint and type expectations under the upgraded toolchain.

## Edge cases and failure modes
- Next 16.2 may introduce lint or config-level incompatibilities.
- Lockfile-only changes can mask stale installed modules, so verification should run after install.
- Existing unrelated workspace changes must remain untouched.

## Test matrix
- `pnpm install` resolves the updated package versions.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.

## Rollout, rollback, and observability notes
- Rollout is a standard dependency upgrade deploy.
- Rollback is a revert of the manifest and lockfile changes.
- No new observability changes are required.
