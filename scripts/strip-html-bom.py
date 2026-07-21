#!/usr/bin/env python3
"""Remove UTF-8 BOM / stray ? prefixes before injected header/footer in HTML files."""

import glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def strip_bom_bytes(path: Path) -> bool:
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        path.write_bytes(raw[3:])
        return True
    return False


def clean_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8-sig")
    original = text
    text = text.replace("\ufeff    <header", "    <header")
    text = text.replace("\ufeff    <footer", "    <footer")
    text = text.replace("?    <header", "    <header")
    text = text.replace("?    <footer", "    <footer")
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main():
    changed = []
    for rel in ["partials/header.html", "partials/footer.html"]:
        p = ROOT / rel
        if p.exists() and strip_bom_bytes(p):
            changed.append(f"BOM removed: {rel}")

    for f in glob.glob(str(ROOT / "**/*.html"), recursive=True):
        if "partials" in f or "faq-accordion-fragment" in f:
            continue
        p = Path(f)
        if clean_html(p):
            changed.append(p.relative_to(ROOT).as_posix())

    print(f"Cleaned {len(changed)} file(s)")
    for line in changed:
        print(" ", line)


if __name__ == "__main__":
    main()
