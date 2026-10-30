# Font optimization and verification

The manual generator reduces the four served WOFF2 outputs to **58,140 bytes**, from **110,128 bytes** across the five original files. Ordinary pages preload and transfer **42,664 bytes**, down from **61,200**: **18,536 bytes / 30.3% less**. The full font inventory shrinks **47.2%**.

`font-display: swap`, fallback families, fallback metric overrides, synthetic bold/italics, page content, and component font settings are preserved. No font processing runs during development or builds. Generated assets are committed.

## Before: exact original assets

Original Google/Next assets are vendored, unmodified, in `scripts/font-sources/`. Their SHA-256 hashes are checked on every generation. Versions: Lilita One 1.002; Work Sans 2.012. Full cmaps, axes, features, glyph counts, sizes and hint-table inventory are in [before-inventory.json](font-optimization/before-inventory.json).

| Original file | Bytes | Glyphs | Axes | GSUB features | GPOS features |
| --- | ---: | ---: | --- | --- | --- |
| Lilita Latin `043945717efb3a31-s.p.woff2` | 10,676 | 214 | static 400 | none | kern |
| Lilita Latin-ext `3b0bcebad1fd47d9-s.woff2` | 1,376 | 14 | static 400 | none | none |
| Work Latin `c9e6921c7fc300d8-s.p.woff2` | 50,524 | 348 | wght 100–900, default 400 | calt, ccmp, cswh, dnom, frac, liga, locl, numr, pnum, rvrn, tnum | kern, mark, mkmk |
| Work Latin-ext `f0a6239bc4153746-s.woff2` | 35,776 | 453 | wght 100–900, default 400 | calt, ccmp, cswh, locl, pnum, rvrn, tnum | kern, mark, mkmk |
| Work Vietnamese `10f65c94012f0d89-s.woff2` | 11,776 | 141 | wght 100–900, default 400 | calt, ccmp, cswh, pnum, tnum | kern, mark, mkmk |

All five originals have **zero glyph hint programs**, no `cvt `, `prep` or `fpgm`, and an 8-byte `gasp` rasterization table (uncompressed table data). Subsetting cannot save hint-program bytes that were already absent.

Every page originally preloaded the same two Latin assets: 10,676 + 50,524 = **61,200 bytes**. The other files were selected through Google's unicode ranges.

## Actual usage

[usage.json](font-optimization/usage.json) records the source audit. It walks TS/TSX literals, JSX text and entities, CSS `content`, utilities, and inline font declarations. Browser measurements additionally record computed styles and actual downloaded faces.

- Body Work Sans uses 400, 500, 600 and 700. The Stripe appearance configuration includes the literal `Work Sans` family and 600 labels; its configuration is unchanged. Receipt-email fonts are separate, not webfont consumers.
- Lilita is a static 400 face. Headings also request 600/700 and obtain the same synthetic bold as before. Inline family overrides occur in the story and fundraising components; they still use the existing CSS variables.
- There is no downloaded italic face. Italics stay synthesized. Tests include bold inside italics, including a 600 parent whose nested `strong` computes to 900.
- Code/`font-mono` uses system monospace. No new code font is added.
- There are no explicit `font-feature-settings` or axis overrides in current page components. Default `calt`, `ccmp`, `liga`, `locl`, `rvrn`, `kern`, `mark`, `mkmk` are retained where applicable. The live `tabular-nums` fundraising number is Lilita, which never had `tnum`; generic chart code uses system mono. Unused Work `cswh`, `dnom`, `frac`, `numr`, `pnum`, `tnum` are removed.
- Current content is predominantly ASCII, with ©, middle dots, curly quotation marks, dashes, ellipsis, star/heart symbols and a variation selector. Supported Latin-1 and Latin Extended-A, used characters and their canonical decompositions are retained. Characters unsupported by the original fonts, including CJK/emoji, stay on the same system fonts.
- Current page CSS uses `hyphens: manual`. Verification deliberately exercises `hyphens: auto` and explicit U+2010 as well.

## Generated files

Exact hashes, cmaps, unicode ranges, aliases, axes and features are in [generated.json](font-optimization/generated.json).

| Served font | Bytes | Glyphs | Weight / axes | Features |
| --- | ---: | ---: | --- | --- |
| Nate Display core | 10,400 | 203 | static 400 | GPOS kern |
| Nate Display extended | 1,192 | 9 | static 400 | none |
| Work Sans core | 32,264 | 242 | wght 400–900, default 400 | GSUB calt, ccmp, liga, locl, rvrn; GPOS kern, mark, mkmk |
| Work Sans extended | 14,284 | 196 | wght 400–900, default 400 | GSUB calt, ccmp, locl; GPOS kern, mark, mkmk |
| **Total** | **58,140** | | | |

Lilita's OFL reserves the name “Lilita.” Both modified files are renamed internally to **Nate Display**. Work files are internally **Nate Body**; their CSS alias remains `Work Sans` so literal component settings continue to work. Original copyright data is retained. OFL texts accompany sources and served assets.

Every generated `unicode-range` contains only actually encoded characters. Small duplicate cmap entries used as shaping support can remain unadvertised, so they do not trigger downloads. Original face order is preserved: extended, core, then the separately named fallback. A single CSS family contains both subsets; no generated fallback is inserted between them.

U+2010 was missing from the original cmaps despite being advertised. Browsers drew it through the existing hyphen mapping. The generator explicitly maps **U+2010 to the existing U+002D glyph**, and Lilita **U+00A0 to its existing space glyph**. This keeps rendering identical and makes the ranges truthful. No new glyph outline or fallback font is introduced. Full Latin-1/Extended-A grid and hyphenation comparisons passed with zero changed pixels.

Fallback descriptors remain exactly:

| Family | Local source | Ascent | Descent | Line gap | Size adjust |
| --- | --- | ---: | ---: | ---: | ---: |
| Lilita One Fallback | Arial | 96.14% | 22.91% | 0.00% | 96.01% |
| Work Sans Fallback | Arial | 83.09% | 21.71% | 0.00% | 111.93% |

Content-hashed filenames receive `Cache-Control: public, max-age=31536000, immutable`. Only the two cores are preloaded, with anonymous CORS, on every route.

## Per-page transfers

These are actual cold first-party font response payloads, not estimates from declarations. Measurements use Chrome's network protocol; all responses were 200 and not from disk cache. Desktop and mobile selected the same files.

| Page / state | Before bytes | After bytes | Preloads after |
| --- | ---: | ---: | --- |
| `/` | 61,200 | 42,664 | both cores |
| `/birthday` | 61,200 | 42,664 | both cores |
| `/donate` | 61,200 | 42,664 | both cores |
| `/donate/return` without parameters | 61,200 | 42,664 | both cores |
| `/donate/return?session_id=font-test` | 61,200 | 42,664 | both cores |
| `/donate/return?payment_intent=font-test` | 61,200 | 42,664 | both cores |
| 404 | 61,200 | 42,664 | both cores |
| Latin-1 fixture: café, Noël, résumé | 61,200 | 42,664 | both cores |
| Extended-A in display text | 62,576 | 43,856 | both cores; display extension requested by text |
| Extended-A in Work text | 96,976 | 56,948 | both cores; Work extension requested by text |
| Full typography fixture | 98,352 | 58,140 | both cores; both extensions requested by text |
| CJK fixture | 61,200 | 42,664 | both cores; no extensions |

No real route, Latin-1 fixture or CJK fixture requested an extension. Each extended fixture requested only its relevant extension. The full fixture requested both. System fonts introduce no webfont transfer.

## Preservation choices and rejected savings

1. **The core includes the original Latin-1 boundary, rather than ASCII alone.** Moving accents into another face changes kerning and run segmentation. A corrected ASCII-only prototype preloaded 28,460 bytes but changed **56,871 / 1,416,000 pixels**, including accented-text spacing. Its duplicated shaping support brought the full payload to 80,200 bytes. Keep the measured zero-change boundary by default. The prototype's early transfer is 14,204 bytes smaller than the shipped cores, with different rendering and a larger full payload.
2. **Work retains the 900 interpolation endpoint.** Published literal weights are 400–700, but general clipping to 700 rounds interpolation deltas/advances: at 700, “A” changes from about 677.400 to 677 font units. Clipping the current Work outputs to 700 would save 5,768 bytes, with changed advances/pixels. The 900 endpoint also supports the nested-bolder test. Lower unused `gvar` tuples and zero-contribution HVAR/GDEF columns are removed without rescaling positive data. No variable axis is frozen.
3. **Keep `post` glyph names and the `.notdef` outline.** FontTools' otherwise normal pruning changed rendered pixels. Pruning Work glyph names would save 1,508 bytes, but glyph-name removal changed 21,893 pixels in an isolated control; empty `.notdef` changed small extended characters. A separate display-font control saved 236 bytes by dropping names but changed 1,526 raster pixels (max channel delta 3), so those names also stay. These are needed for the measured rendering, even where an outline/advance-only check passes.
4. **Keep `gasp` rasterization metadata.** Removing it changed four antialiasing edge pixels at a 192px display size. Keeping it produced an exact match in its isolated test. Final native rasterization can still differ by four one-level edge values in a 192px font-only control; these are reported below, not hidden. There are no glyph hint programs in the output. Dropping `gasp` from the final four files would save just 44 compressed bytes in total. Compression is nonmonotonic: the display extension would grow by 4 bytes.

Per-file rejected-variant sizes are recorded in [alternatives.json](font-optimization/alternatives.json). Removing `gasp` changes compressed sizes nonmonotonically; the record includes the measured savings or increase for each file.

The only departures from the proposed ASCII/range/hint pruning are the preservation choices above. There are no false unicode-range entries, no font-display/fallback changes, no build-time font processing, no new italic or CJK assets, and no content changes.

## Pixel evidence and limits

[verification.json](font-optimization/verification.json) contains the unthresholded per-view counts, dimensions, SHA-256 image hashes, text/layout checks and font transfers. Selected before/after images and amplified differences are in the [offline evidence viewer](font-optimization/report.html) and [evidence/](font-optimization/evidence/). The complete local image report is `output/playwright/font-optimization/final/report.html`.

Both production builds used the same current source/content/dependencies. The primary dirty checkout was copied without changing it; only font integration differed. Original font bytes were pinned for the baseline, not downloaded again from changing Google URLs. Source font output is identical for the isolated branch and the current-content snapshot.

Verification covers all page routes, both return identifiers, 404, code, regular/synthetic italic, nested bold, 400/500/600/700/900, accented and combining characters, inline family settings, automatic hyphens and CJK. Desktop: 1440×1000 at 1×. Mobile: 390×844 at 2×. Browser: Chrome 156 on macOS. Other engines/operating systems were not pixel-tested.

Donation responses and the gallery's existing local fallback photos are fixed fixtures. Payment calls are stubbed; no real payment is created. Optional social providers are held in their existing first-party fallback state to avoid asynchronous iframe content changes. No text or font region is masked.

The final independent-build run compared **66,245,520 pixels across 24 views**. **21/24** were bit-exact. Remaining raw differences: donate desktop **726 pixels, max channel delta 1**; return-intent-error mobile **298,434, max 3**; 404 mobile **2,081, max 1**. All 24 text and layout comparisons match. Every typography/Latin/CJK fixture is bit-exact. The complete repertoire grid adds **10,160,640 pixels with zero differences**. Font-only donate and return controls are exact; the large 404 control has **4/1,316,640 pixels at one color level**, consistent with antialias coverage rounding, with identical outlines/advances.

Earlier transient motion/content differences were investigated and recaptured after fonts/hydration settled. Some independent Chrome paints vary by 1–3/255 in blurred/textured backgrounds even with identical font bytes. Their raw counts and identical-font controls are retained in the evidence; these are compositor rounding, not geometry/content changes. Font-only controls on the same settled DOM isolate the font change. No visible typography difference is accepted as a regression waiver.

## Regenerate by hand

Install the normal locked Node dependencies, then:

```sh
uv run scripts/subset-fonts.py
```

The script uses pinned FontTools, Brotli and HarfBuzz dependencies, with vendored source fonts and hash checks. It scans usage, subsets, clips without re-interpolating positive data, removes unused features/hint programs, preserves rasterization metadata, renames, writes WOFF2/CSS/preloads/inventories/licenses, reopens every result, and checks outlines/advances. It also fails if new content requires another original source subset instead of silently dropping that coverage.

Commit `app/fonts.css`, `lib/font-preloads.ts`, `public/fonts/`, and the generated JSON alongside any generator/source changes. Re-run after changing copy, dynamic content formats, CSS/pseudo-content, font family/weight/style/feature/axis settings, component overrides, locales, or font sources. Review `usage.json` and update the retained feature policy when enabling a new feature. Re-run pixel comparisons before accepting regenerated bytes.

Normal `pnpm dev` / `pnpm build` never execute the generator.

## Repeat the production comparison

Create a baseline from the *same* current content. The helper restores only the old font integration and writes pinned Google responses:

```sh
node scripts/prepare-font-baseline.mjs /private/tmp/nate-font-before
```

In that new directory:

```sh
pnpm install --frozen-lockfile
NEXT_FONT_GOOGLE_MOCKED_RESPONSES="$PWD/.font-baseline-google.cjs" NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_font_audit pnpm exec next build --webpack
pnpm exec next start --port 3211
```

Build the optimized repo normally and start it on port 3215. In another terminal at the repository root:

```sh
pnpm dlx @playwright/cli -s=font-check open about:blank --browser chrome
pnpm dlx @playwright/cli -s=font-check run-code "$(cat scripts/verify-fonts-browser.js)" > /private/tmp/font-measurements.txt
```

Save the JSON under the CLI's `### Result` heading as `/private/tmp/font-measurements.json`, then:

```sh
uv run scripts/compare-font-pixels.py /private/tmp/font-measurements.json
```

The comparator has **zero tolerance** and exits nonzero for any changed pixel, text or layout. Investigate failures; do not increase a threshold to hide a font change. The helper's browser function declares the two localhost ports at the top if different ports are needed.

Core embedding in global CSS and idle precaching of extensions are deliberately deferred. Idle precaching would add 15,476 font bytes to pages that currently never need the extensions; measure that tradeoff separately.

References: [FontTools subset](https://fonttools.readthedocs.io/en/stable/subset/), [FontTools instancer](https://fonttools.readthedocs.io/en/latest/varLib/instancer.html), [Next font reference](https://nextjs.org/docs/app/api-reference/components/font). Installed-version Next documentation and loader source were inspected before changing the integration.
