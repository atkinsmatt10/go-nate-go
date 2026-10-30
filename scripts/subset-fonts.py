#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.68.0", "brotli==1.2.1", "uharfbuzz==0.57.0", "zopfli==0.4.3"]
# ///
"""Manual, deterministic font generation. Never invoked by Next or package scripts.

Run from the repository: uv run scripts/subset-fonts.py
Review docs/font-optimization.md and re-run the browser comparison after changes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import unicodedata

from fontTools import subset
from fontTools.varLib import builder
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

CORE_PUNCTUATION = {0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201A,
                    0x201C, 0x201D, 0x201E, 0x2022, 0x2026}
FEATURES = ["calt", "ccmp", "liga", "locl", "rvrn", "kern", "mark", "mkmk"]
# Match the browser's existing character substitutions explicitly. This avoids
# advertising a missing U+2010 while preserving hyphenation and NBSP spacing.
COMPATIBILITY_ALIASES = {0x2010: 0x002D, 0x00A0: 0x0020}
FONT_CONFIG = [
    {"id": "nate-display", "family": "Nate Display", "sourceFamily": "Lilita One",
     "core": "lilita-one-latin.woff2", "extended": "lilita-one-latin-ext.woff2",
     "features": ["kern"], "weight": "400", "fallback": "Lilita One Fallback",
     "metrics": ["96.14%", "22.91%", "0.00%", "96.01%"]},
    {"id": "work-sans", "family": "Work Sans", "sourceFamily": "Work Sans",
     "core": "work-sans-latin.woff2", "extended": "work-sans-latin-ext.woff2",
     "features": FEATURES, "weight": "400 900", "fallback": "Work Sans Fallback",
     "metrics": ["83.09%", "21.71%", "0.00%", "111.93%"]},
]
HINT_TABLES = ["cvt ", "cvar", "fpgm", "prep", "hdmx", "VDMX", "LTSH", "gasp"]


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def ranges(points: set[int]) -> str:
    ordered = sorted(points)
    spans: list[tuple[int, int]] = []
    for cp in ordered:
        if spans and cp == spans[-1][1] + 1:
            spans[-1] = spans[-1][0], cp
        else:
            spans.append((cp, cp))
    return ", ".join(f"U+{a:04X}" + (f"-{b:04X}" if a != b else "") for a, b in spans)


def features(font: TTFont) -> dict[str, list[str]]:
    return {tag: sorted({r.FeatureTag for r in font[tag].table.FeatureList.FeatureRecord})
            for tag in ["GSUB", "GPOS"] if tag in font and font[tag].table.FeatureList}


def inventory(path: Path) -> dict:
    font = TTFont(path, recalcBBoxes=False, recalcTimestamp=False)
    programs = [n for n in font.getGlyphOrder()
                if getattr(font["glyf"][n], "program", None)
                and font["glyf"][n].program.getBytecode()]
    return {"bytes": path.stat().st_size, "sha256": sha256(path.read_bytes()),
            "glyphs": len(font.getGlyphOrder()), "cmap": sorted(font.getBestCmap()),
            "axes": [{"tag": a.axisTag, "min": a.minValue, "default": a.defaultValue,
                      "max": a.maxValue} for a in font["fvar"].axes] if "fvar" in font else [],
            "features": features(font), "hintTables": [t for t in HINT_TABLES if t in font],
            "hintedGlyphs": len(programs)}


def clip_unused_negative_weight(font: TTFont, minimum: int) -> None:
    """Clip at the existing default without re-interpolating positive tuples.

    General varLib instancing rounds new endpoint deltas. Used positive tuples
    must remain byte-for-byte values. A lower bound at the default needs no
    rescaling. Keep the 900 endpoint: clipping it to 700 changed real pixels.
    """
    if "fvar" not in font:
        return
    axes = font["fvar"].axes
    assert len(axes) == 1 and axes[0].axisTag == "wght"
    if minimum < axes[0].defaultValue:
        return  # A new lighter weight needs the original negative interpolation.
    axes[0].minValue = axes[0].defaultValue
    # Named instances are editor conveniences, unused by CSS.
    font["fvar"].instances = []
    for glyph, tuples in font["gvar"].variations.items():
        font["gvar"].variations[glyph] = [
            t for t in tuples if not ("wght" in t.axes and t.axes["wght"][1] < 0
                                     and t.axes["wght"][2] <= 0)]


def prune_unused_variation_columns(font: TTFont) -> None:
    """Remove zero-contribution regions without changing positive values/indices."""
    if "fvar" not in font or font["fvar"].axes[0].minValue != font["fvar"].axes[0].defaultValue:
        return
    for tag in ["HVAR", "GDEF"]:
        table = font[tag].table if tag in font else None
        store = getattr(table, "VarStore", None)
        if not store:
            continue
        regions = store.VarRegionList.Region
        negative = {i for i, region in enumerate(regions)
                    if len(region.VarRegionAxis) == 1
                    and region.VarRegionAxis[0].PeakCoord < 0
                    and region.VarRegionAxis[0].EndCoord <= 0}
        for data in store.VarData:
            keep = [i for i, index in enumerate(data.VarRegionIndex) if index not in negative]
            data.VarRegionIndex = [data.VarRegionIndex[i] for i in keep]
            data.Item = [[item[i] for i in keep] for item in data.Item]
            data.VarRegionCount = len(data.VarRegionIndex)
            builder.VarData_calculateNumShorts(data, optimize=False)
        active = sorted({i for data in store.VarData for i in data.VarRegionIndex})
        remap = {old: i for i, old in enumerate(active)}
        store.VarRegionList.Region = [regions[i] for i in active]
        store.VarRegionList.RegionCount = len(active)
        for data in store.VarData:
            data.VarRegionIndex = [remap[i] for i in data.VarRegionIndex]


def rename(font: TTFont, family: str) -> None:
    # Both font families are renamed internally. Lilita's OFL requires this.
    ps = family.replace(" ", "")
    for name_id in [1, 3, 4, 6, 16, 17, 25]:
        font["name"].removeNames(nameID=name_id)
    for name_id, value in {1: family, 3: f"{ps}-Regular-subset-v1", 4: family,
                           6: f"{ps}-Regular", 16: family, 17: "Regular", 25: ps}.items():
        font["name"].setName(value, name_id, 3, 1, 0x409)


def compare_outlines(original: TTFont, generated: TTFont, weights: list[int], aliases: dict[int, int]) -> None:
    def close(a, b):
        if isinstance(a, (float, int)) and isinstance(b, (float, int)):
            return abs(a - b) < 1e-9
        if isinstance(a, (tuple, list)) and isinstance(b, (tuple, list)):
            return len(a) == len(b) and all(close(x, y) for x, y in zip(a, b))
        return a == b
    for weight in weights if "fvar" in original else [400]:
        old = original.getGlyphSet(location={"wght": weight})
        new = generated.getGlyphSet(location={"wght": weight})
        for cp, name in generated.getBestCmap().items():
            old_name = original.getBestCmap()[aliases.get(cp, cp)]
            p, q = DecomposingRecordingPen(old), DecomposingRecordingPen(new)
            old[old_name].draw(p)
            new[name].draw(q)
            assert close(p.value, q.value), f"Changed outline U+{cp:04X} at {weight}"
            assert close(old[old_name].width, new[name].width), f"Changed advance U+{cp:04X}"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    source = Path(__file__).resolve().parent / "font-sources"
    source_manifest = json.loads((source / "manifest.json").read_text())
    for name, expected in source_manifest["files"].items():
        assert sha256((source / name).read_bytes()) == expected["sha256"], f"Changed source {name}"
    usage = json.loads(subprocess.check_output(
        ["node", str(Path(__file__).with_name("audit-font-usage.mjs")), str(root)], text=True))
    weights = usage["weights"]
    assert weights and 100 <= min(weights) <= max(weights) <= 900
    # Preserve supported Latin-1 and Extended-A, source text, common punctuation,
    # and canonical decompositions. Unsupported CJK/emoji stay on existing fonts.
    wanted = set(range(0x20, 0x180)) | set(usage["codepoints"]) | set(usage["sideEffectCodepoints"]) | CORE_PUNCTUATION
    wanted |= {ord(ch) for cp in list(wanted) for ch in unicodedata.normalize("NFD", chr(cp))}
    output = root / "public/fonts"
    output.mkdir(parents=True, exist_ok=True)
    # Distribute the OFL texts with the served fonts. These are never preloaded.
    for license_file in ["lilita-one-OFL.txt", "work-sans-OFL.txt"]:
        (output / license_file).write_bytes((source / license_file).read_bytes())
    manifest = {"generator": "scripts/subset-fonts.py", "weightsInSource": weights,
                "sources": source_manifest, "fonts": [], "preloads": []}
    css = ["/* Generated by scripts/subset-fonts.py. Run manually; commit this and the WOFF2 files. */"]
    preloads: list[str] = []
    for config in FONT_CONFIG:
        original_core = TTFont(source / config["core"], recalcBBoxes=False, recalcTimestamp=False)
        # Preserve the original Latin face boundary, not an ASCII-only split:
        # moving accents changed kerning. Retain extra cmap characters for shaping
        # but do not advertise them in unicode-range (e.g. a space in Latin-ext).
        original_latin = set(source_manifest["latinRanges"])
        advertised_core = wanted & set(original_core.getBestCmap()) & original_latin
        source_coverage = set()
        for source_file in source_manifest["files"]:
            source_font = TTFont(source / source_file, recalcBBoxes=False, recalcTimestamp=False)
            if source_font["name"].getDebugName(1) == config["sourceFamily"]:
                source_coverage.update(source_font.getBestCmap())
        generated_coverage = set()
        face_rules = {}
        for part in ["core", "extended"]:
            src = source / config[part]
            original = TTFont(src, recalcBBoxes=False, recalcTimestamp=False)
            font = TTFont(src, recalcBBoxes=False, recalcTimestamp=False)
            clip_unused_negative_weight(font, min(weights))
            options = subset.Options()
            options.hinting = False
            options.glyph_names = True  # Removing post names changed 21,893 test pixels.
            options.notdef_outline = True  # Empty .notdef changed small extended glyphs.
            options.layout_features = config["features"]
            options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17, 25]
            options.name_languages = [0x409]
            options.recalc_timestamp = False
            subsetter = subset.Subsetter(options=options)
            subsetter.populate(unicodes=wanted & set(font.getBestCmap()))
            subsetter.subset(font)
            # gasp controls rasterization, not glyph hint programs. Dropping it
            # changed four Lilita edge pixels at 192px. Preserve source behavior
            # in both families, as FontTools' no-hinting mode normally does.
            drop_hints = [t for t in HINT_TABLES if t != "gasp"]
            for tag in drop_hints + ["DSIG"]:
                if tag in font:
                    del font[tag]
            rename(font, "Nate Display" if config["id"] == "nate-display" else "Nate Body")
            prune_unused_variation_columns(font)
            aliases = {}
            if part == "core":
                for cp, target_cp in COMPATIBILITY_ALIASES.items():
                    if cp not in font.getBestCmap() and target_cp in font.getBestCmap():
                        for table in font["cmap"].tables:
                            if table.isUnicode() and target_cp in table.cmap:
                                table.cmap[cp] = table.cmap[target_cp]
                        aliases[cp] = target_cp
                advertised_core |= set(aliases)
            font.flavor = "woff2"
            temporary = output / f"{config['id']}-{part}.tmp.woff2"
            font.save(temporary)
            actual = TTFont(temporary, recalcBBoxes=False, recalcTimestamp=False)
            cmap = set(actual.getBestCmap())
            generated_coverage.update(cmap)
            advertised = cmap & advertised_core if part == "core" else cmap - advertised_core
            # Re-open output: don't assume a subsetter honored a requested option.
            assert cmap <= (set(original.getBestCmap()) | set(aliases)) & wanted
            assert advertised <= cmap
            assert not any(0x3400 <= cp <= 0x9FFF for cp in cmap)
            assert not any(t in actual for t in drop_hints)
            assert actual["post"].formatType == 2.0
            assert all("Lilita" not in (actual["name"].getDebugName(n) or "")
                       for n in [1, 3, 4, 6, 16, 17, 25])
            assert all(set(tags) <= set(config["features"]) for tags in features(actual).values())
            compare_outlines(original, actual, sorted(set(weights) | {400, 900}), aliases)
            digest = sha256(temporary.read_bytes())
            filename = f"{config['id']}-{part}.{digest[:12]}.woff2"
            target = output / filename
            temporary.replace(target)
            entry = {"family": config["family"], "part": part, "file": f"/fonts/{filename}",
                     **inventory(target), "advertisedCodepoints": sorted(advertised),
                     "compatibilityAliases": {f"U+{cp:04X}": f"U+{target:04X}" for cp, target in aliases.items()},
                     "unicodeRange": ranges(advertised)}
            manifest["fonts"].append(entry)
            if part == "core":
                preloads.append(entry["file"])
            weight = config["weight"] if min(weights) >= 400 else ("100 900" if "fvar" in actual else "400")
            face_rules[part] = (f"@font-face {{\n  font-family: '{config['family']}';\n"
                                f"  font-style: normal;\n  font-weight: {weight};\n"
                                f"  font-display: swap;\n  src: url('{entry['file']}') format('woff2');\n"
                                f"  unicode-range: {entry['unicodeRange']};\n}}")
        missing = (wanted & source_coverage) - generated_coverage
        assert not missing, (
            f"Content needs another source subset for {config['family']}: {ranges(missing)}. "
            "Extend the generator and repeat the pixel audit before publishing.")
        # Face order affects shaping at the boundary. Match Google's order.
        css.extend([face_rules["extended"], face_rules["core"]])
        a, d, gap, adjust = config["metrics"]
        css.append(f"@font-face {{\n  font-family: '{config['fallback']}';\n  src: local('Arial');\n"
                   f"  ascent-override: {a};\n  descent-override: {d};\n"
                   f"  line-gap-override: {gap};\n  size-adjust: {adjust};\n}}")
    css.append('.campaign-fonts {\n  --font-lilita-one: "Nate Display", "Lilita One Fallback";\n'
               '  --font-work-sans: "Work Sans", "Work Sans Fallback";\n}')
    (root / "app/fonts.css").write_text("\n\n".join(css) + "\n")
    (root / "lib/font-preloads.ts").write_text(
        '// Generated by scripts/subset-fonts.py; do not edit by hand.\n'
        'export const fontPreloads = ' + json.dumps(preloads, indent=2) + ' as const\n')
    docs = root / "docs/font-optimization"
    docs.mkdir(parents=True, exist_ok=True)
    manifest["preloads"] = preloads
    (docs / "generated.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (docs / "usage.json").write_text(json.dumps(usage, ensure_ascii=False, indent=2) + "\n")
    # Delete only stale outputs of this generator, never source fonts or other files.
    keep = {Path(f["file"]).name for f in manifest["fonts"]}
    for config in FONT_CONFIG:
        for old in output.glob(f"{config['id']}-*.woff2"):
            if old.name not in keep:
                old.unlink()
    print(json.dumps({"preloadedBytes": sum(f["bytes"] for f in manifest["fonts"] if f["part"] == "core"),
                      "allFontBytes": sum(f["bytes"] for f in manifest["fonts"]),
                      "fonts": [{k: f[k] for k in ["file", "bytes", "glyphs", "axes"]}
                                for f in manifest["fonts"]]}, indent=2))


if __name__ == "__main__":
    main()
