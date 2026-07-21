#!/usr/bin/env python3
"""Scan HTML for common ? punctuation corruption (not URL query strings)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PATTERNS = [
    r"24\?48",
    r"MCT \?",
    r"isn\?t",
    r"we\?ll",
    r"team \?$",
    r'footer__copy">\? ',
    r"Portal \? Hook",
    r"asymptomatic\?",
    r"Wear \?",
    r"^\s+\?\s*$",
]

for path in sorted(ROOT.rglob("*.html")):
    if "node_modules" in path.parts:
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        if "?" not in line:
            continue
        if re.search(r"https?://[^\s\"']*\?", line) or "?dnt=" in line or "?interest=" in line or "?v=" in line:
            # skip URL query strings only lines - but line might have both
            pass
        for pat in PATTERNS:
            if re.search(pat, line):
                hits.append((i, line.strip()[:100]))
                break
        else:
            if line.strip() == "?":
                hits.append((i, line.strip()))
    if hits:
        print(path.relative_to(ROOT))
        for i, snippet in hits:
            print(f"  L{i}: {snippet}")
