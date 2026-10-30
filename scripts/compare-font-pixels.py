#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Compare the JSON returned by scripts/verify-fonts-browser.js. No tolerance."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
from PIL import Image, ImageChops, ImageEnhance

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("measurements", type=Path)
parser.add_argument("--root", type=Path, default=Path.cwd())
args = parser.parse_args()
measurements = json.loads(args.measurements.read_text())
rows = {}
for item in measurements["cases"]:
    rows.setdefault((item["id"], item["viewport"]), {})[item["version"]] = item
result = {"browser": measurements["browser"], "threshold": 0, "comparisons": []}
failed = False
for (case, viewport), pair in rows.items():
    before, after = pair["before"], pair["after"]
    old_path, new_path = [args.root / item["screenshot"] for item in [before, after]]
    old, new = [Image.open(p).convert("RGB") for p in [old_path, new_path]]
    if old.size != new.size:
        result["comparisons"].append({"case": case, "viewport": viewport, "error": "dimensions changed", "before": old.size, "after": new.size})
        failed = True
        continue
    difference = ImageChops.difference(old, new)
    channels = difference.split()
    maximum = ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])
    histogram = maximum.histogram()
    pixels = old.width * old.height
    changed = pixels - histogram[0]
    max_delta = max(b[1] for b in difference.getextrema())
    diff_path = new_path.with_name(f"{case}-{viewport}-diff.png")
    ImageEnhance.Brightness(difference).enhance(8).save(diff_path)
    text_equal = before["text"] == after["text"]
    # Family labels intentionally change for the OFL-reserved display name.
    def layout(item):
        return [{k: v for k, v in style.items() if k != "font"} for style in item["textStyles"]]
    layout_equal = layout(before) == layout(after)
    row = {"case": case, "viewport": viewport, "size": old.size,
           "changedPixels": changed, "totalPixels": pixels, "maxChannelDelta": max_delta,
           "textEqual": text_equal, "layoutEqual": layout_equal,
           "beforeFontBytes": sum(f["bytes"] for f in before["fonts"]),
           "afterFontBytes": sum(f["bytes"] for f in after["fonts"]),
           "beforeFonts": before["fonts"], "afterFonts": after["fonts"],
           "beforePreloads": before["preloads"], "afterPreloads": after["preloads"],
           "images": {"before": before["screenshot"], "after": after["screenshot"],
                      "diff": str(diff_path.relative_to(args.root))},
           "sha256": {"before": hashlib.sha256(old_path.read_bytes()).hexdigest(),
                      "after": hashlib.sha256(new_path.read_bytes()).hexdigest()}}
    result["comparisons"].append(row)
    if changed or not text_equal or not layout_equal:
        failed = True
    print(f"{case:22} {viewport:7} {changed:9,}/{pixels:,} pixels; fonts {row['beforeFontBytes']:,} -> {row['afterFontBytes']:,}; text={text_equal}; layout={layout_equal}")
result["totalChangedPixels"] = sum(r.get("changedPixels", 0) for r in result["comparisons"])
result["totalPixels"] = sum(r.get("totalPixels", 0) for r in result["comparisons"])
result["passed"] = not failed
output = args.measurements.with_name("pixel-results.json")
output.write_text(json.dumps(result, indent=2) + "\n")
print(f"Saved {output}; passed={not failed}")
sys.exit(1 if failed else 0)
