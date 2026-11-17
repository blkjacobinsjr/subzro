#!/usr/bin/env python3
"""Make the local Playfair italic 600 Latin face used by the app."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
CSS_SOURCE = ROOT / "scripts/fonts/source/google-css/global.css"
FONT_SOURCE = ROOT / "scripts/fonts/source/google-woff2"
OFL_SOURCE = ROOT / "scripts/fonts/source/licenses/PlayfairDisplay-OFL.txt"
OUTPUT_DIR = ROOT / "public/fonts/playfair"
CSS_OUTPUT = ROOT / "src/fonts/playfair.generated.css"
REPORT_OUTPUT = ROOT / "scripts/fonts/playfair-report.json"
CSS_FACES = (("italic", 600),)
OUTPUT_FACES = (("italic", "600", ("italic", 600)),)
LATIN_RANGE = "latin"
HEAD_FIELDS = ("xMin", "yMin", "xMax", "yMax", "created", "modified")
DEFAULT_FEATURES = {"GSUB": {"ccmp", "locl", "liga", "clig", "calt", "rlig"},
                    "GPOS": {"kern", "mark", "mkmk"}}


def parse_css() -> dict[tuple[str, int], tuple[Path, set[int]]]:
    faces = {}
    css = CSS_SOURCE.read_text()
    pattern = re.compile(r"/\*\s*([^*]+?)\s*\*/\s*@font-face\s*\{([^}]+)\}", re.S)
    for match in pattern.finditer(css):
        subset_name, body = match.groups()
        family = re.search(r"font-family:\s*['\"]?([^;'\"]+)", body)
        if not family or family.group(1).strip() != "Playfair Display":
            continue
        if subset_name.strip().lower() != LATIN_RANGE:
            continue
        style = re.search(r"font-style:\s*(normal|italic)", body).group(1)
        weight = int(re.search(r"font-weight:\s*(\d+)", body).group(1))
        url = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)", body).group(1)
        path = FONT_SOURCE / url.rsplit("/", 1)[1]
        range_text = re.search(r"unicode-range:\s*([^;]+);", body).group(1)
        if (style, weight) in CSS_FACES:
            faces[(style, weight)] = (path, decode_range(range_text))
    missing = [face for face in CSS_FACES if face not in faces or not faces[face][0].is_file()]
    if missing:
        raise RuntimeError(f"Missing Google CSS sources: {missing}")
    return faces


def decode_range(value: str) -> set[int]:
    codepoints = set()
    for token in value.split(","):
        match = re.fullmatch(r"\s*U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?\s*", token)
        if not match:
            raise RuntimeError(f"Unsupported unicode-range token: {token!r}")
        start = int(match.group(1), 16)
        end = int(match.group(2), 16) if match.group(2) else start
        codepoints.update(range(start, end + 1))
    return codepoints


def encode_range(codepoints: set[int]) -> str:
    points = sorted(codepoints)
    spans = []
    if points:
        first = previous = points[0]
        for point in points[1:]:
            if point == previous + 1:
                previous = point
                continue
            spans.append((first, previous))
            first = previous = point
        spans.append((first, previous))
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in spans)


def cmap(font: TTFont) -> set[int]:
    return set().union(*(set(table.cmap) for table in font["cmap"].tables if table.isUnicode()))


def table_features(font: TTFont) -> dict[str, list[str]]:
    return {tag: sorted({record.FeatureTag for record in font[tag].table.FeatureList.FeatureRecord})
            for tag in ("GSUB", "GPOS") if tag in font}


def rename_reserved_name(font: TTFont, style: str) -> None:
    family = "Subzro Serif"
    subfamily = "Regular" if style == "normal" else "SemiBold Italic"
    full_name = f"{family} {subfamily}"
    postscript = "SubzroSerif-Regular" if style == "normal" else "SubzroSerif-SemiBoldItalic"
    fixed = {1: family, 2: subfamily, 3: f"1.203;Subzro;{postscript}", 4: full_name, 6: postscript,
             16: family, 17: subfamily, 18: full_name, 21: family, 22: subfamily}
    records = list(font["name"].names)
    for record in records:
        if record.nameID == 0:
            continue
        value = fixed.get(record.nameID)
        if value is None:
            try:
                old_value = record.toUnicode()
            except Exception:
                continue
            value = old_value.replace("Playfair Display", family).replace("PlayfairDisplay", "SubzroSerif")
        font["name"].setName(value, record.nameID, record.platformID, record.platEncID, record.langID)


def info(font: TTFont) -> dict:
    cp = cmap(font)
    axes = []
    if "fvar" in font:
        axes = [{"tag": axis.axisTag, "min": axis.minValue, "default": axis.defaultValue,
                 "max": axis.maxValue} for axis in font["fvar"].axes]
    instruction_bytes = 0
    if "glyf" in font:
        for glyph in font["glyf"].glyphs.values():
            program = getattr(glyph, "program", None)
            if program:
                instruction_bytes += len(program.getBytecode())
    return {"bytes": None, "glyphs": len(font.getGlyphOrder()), "codepoints": len(cp), "axes": axes,
            "features": table_features(font), "hint_tables": [tag for tag in
            ("fpgm", "prep", "cvt ", "gasp", "hdmx", "LTSH", "VDMX") if tag in font],
            "glyph_instruction_bytes": instruction_bytes,
            "head": {key: getattr(font["head"], key) for key in HEAD_FIELDS}, "codepoint_set": cp}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--feature-profile", choices=("all", "default"), default="default")
    parser.add_argument("--hint-profile", choices=("keep", "drop"), default="drop")
    args = parser.parse_args()
    sources = parse_css()
    shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    report = {"feature_profile": args.feature_profile, "hint_profile": args.hint_profile,
              "hinting_note": "The drop profile removes glyph hint instructions. The source has none; gasp is retained as rendering policy.",
              "source_css_sha256": hashlib.sha256(CSS_SOURCE.read_bytes()).hexdigest(),
              "ofl_sha256": hashlib.sha256(OFL_SOURCE.read_bytes()).hexdigest(),
            "reserved_font_names": re.findall(
                r'with Reserved Font Name\s+"([^"]+)"',
                OFL_SOURCE.read_text().splitlines()[0], re.I),
              "faces": [], "source_faces": {}}
    css_blocks = []
    for style, weight_descriptor, source_key in OUTPUT_FACES:
        source_path, original_range = sources[source_key]
        font = TTFont(source_path)
        source_info = info(font)
        source_info["bytes"] = source_path.stat().st_size
        report["source_faces"].setdefault(str(source_path.name),
            {key: value for key, value in source_info.items() if key != "codepoint_set"} |
            {"sha256": hashlib.sha256(source_path.read_bytes()).hexdigest()})
        source_head = {key: getattr(font["head"], key) for key in HEAD_FIELDS}
        source_chars = cmap(font)
        font.recalcBBoxes = False
        font.recalcTimestamp = False
        options = subset.Options()
        options.flavor = "woff2"
        options.recalc_bounds = False
        options.recalc_timestamp = False
        options.hinting = args.hint_profile == "keep"
        options.layout_scripts = ["*"]
        options.layout_features = ["*"] if args.feature_profile == "all" else sorted(
            DEFAULT_FEATURES.get("GSUB", set()) | DEFAULT_FEATURES.get("GPOS", set()))
        options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
        options.name_legacy = True
        options.name_languages = [0x409]
        options.glyph_names = True
        options.notdef_glyph = options.notdef_outline = True
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=source_chars)
        subsetter.subset(font)
        for key, value in source_head.items():
            setattr(font["head"], key, value)
        rename_reserved_name(font, style)
        filename = f"playfair-normal-500-700-latin.woff2" if style == "normal" else "playfair-italic-600-latin.woff2"
        output = OUTPUT_DIR / filename
        font.flavor = "woff2"
        font.save(output)
        output_font = TTFont(output)
        output_info = info(output_font)
        output_info["bytes"] = output.stat().st_size
        output_info["sha256"] = hashlib.sha256(output.read_bytes()).hexdigest()
        face_range = original_range & output_info["codepoint_set"]
        row = {"file": str(output.relative_to(ROOT)), "style": style, "weight": weight_descriptor,
               "source_file": source_path.name, "source_bytes": source_path.stat().st_size,
               "source_glyphs": source_info["glyphs"], "source_codepoints": source_info["codepoints"],
               "bytes": output_info["bytes"], "glyphs": output_info["glyphs"],
               "codepoints": output_info["codepoints"], "unicode_range": encode_range(face_range),
               "axes": output_info["axes"], "features": output_info["features"],
               "hint_tables": output_info["hint_tables"], "glyph_instruction_bytes": output_info["glyph_instruction_bytes"],
               "head": output_info["head"], "sha256": output_info["sha256"]}
        report["faces"].append(row)
        css_blocks.append("\n".join(["@font-face {", "  font-family: 'Playfair Display';",
            f"  font-style: {style};", f"  font-weight: {weight_descriptor};", "  font-display: swap;",
            f"  src: url('/fonts/playfair/{filename}') format('woff2');",
            f"  unicode-range: {row['unicode_range']};", "}"]))
    CSS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    CSS_OUTPUT.write_text("\n\n".join(css_blocks) + "\n")
    REPORT_OUTPUT.write_text(json.dumps(report, indent=2, sort_keys=True, default=str) + "\n")
    print(f"Generated profile={args.feature_profile} total={sum(row['bytes'] for row in report['faces'])} B")
    for row in report["faces"]:
        print(f"{row['style']} {row['weight']}: {row['bytes']} B, {row['glyphs']} glyphs, {row['codepoints']} codepoints")


if __name__ == "__main__":
    main()
