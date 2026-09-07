# Motion and client architecture

September 7, 2026 · baseline `754db47`

The animation update reduces work needed at the top of the homepage while preserving campaign copy, design, donation behavior, and reduced-motion preferences. The hero and story remain Server Components. Mux still loads only after Play, and social providers retain their existing viewport gating and fallback links.

## Scoped loading

Remaining Motion elements use `motion/react-m`; hooks, feature bundles, and type-only imports use `motion/react`. A strict `LazyMotion` provider wraps only the homepage's fundraising/merchandise/social subtree, the donation page, and the 404 page. The root layout, birthday page, and donation return page mount no provider.

On the homepage, the animation feature import starts when that subtree approaches within 200px of the viewport. Donation and 404 providers start after hydration. Each provider passes Motion one stable promise, resolved when the import succeeds. Children stay mounted throughout, preserving polling, form values, and checkout state. An effect cleanup prevents updates after unmount.

The homepage feature module exports `domMax`, which retains the carousel's constrained drag, swipe, exit animations, and gesture behavior. Donation and 404 pages import the smaller `domAnimation` bundle, retaining their hover effects without downloading drag/layout features. [Motion feature bundles](https://motion.dev/docs/react-reduce-bundle-size)

An initial provider in the root layout reduced critical JavaScript by about 19KiB but increased total JavaScript before interaction by about 9KiB, with unchanged LCP. The final provider placement defers actual homepage transfer and avoids starting animation features on unrelated routes.

## Accurate content when features are unavailable

The fundraising bar and shark position now use ordinary React styles with CSS transitions: 900ms and the existing `cubic-bezier(0.23, 1, 0.32, 1)` curve, or zero duration with reduced motion. Their width/position therefore follow refreshed totals even while Motion features are pending or have failed. Progress accessibility values, visible totals, polling, and last-confirmed-data behavior remain intact.

Feature-import failures are caught and logged without passing an unhandled rejection to Motion. The affected provider receives `data-motion-state="failed"`; scoped CSS restores opacity and transform only on marked reveal elements. A no-JavaScript stylesheet supplies the same static fallback. Donation content retains its existing `initial={false}` behavior and remains interactive while animation is unavailable. The provider never conditionally replaces its children.

## Merchandise gestures

The baseline's native anchor/image drag interrupted desktop swipe input, although touch swipe worked. Disabling native dragging on the product anchor and image lets Motion receive the complete gesture.

A ref records an actual Motion drag and resets on the next pointerdown. The anchor suppresses the resulting pointer click, preventing an unintended shop popup. Keyboard activation remains available immediately after a drag because its click has `detail === 0`; the next ordinary pointer click also works. This uses no suppression timer.

## Verification coverage

The regression suite covers real mouse drag, trusted browser touch input, keyboard product selection under reduced motion, and subsequent keyboard/pointer shop activation with intercepted destinations. It also retains checkout cancellation/retry, donation validation and polling, poster-first media loading, reduced-motion behavior, and archived birthday checks. No-JavaScript coverage now checks fundraising links and computed merchandise visibility.

The production loading check resolves feature assets from the emitted manifest, excluding scripts already required for hydration. It checks viewport-triggered requests, donation interaction before delayed features arrive, state preservation afterward, and visible content when feature loading fails. Final measurements, screenshots, and pass results belong to the modernization delivery report.
