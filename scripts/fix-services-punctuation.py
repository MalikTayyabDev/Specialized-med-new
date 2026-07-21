#!/usr/bin/env python3
"""Restore corrupted punctuation in services.html (? replaced UTF-8 chars)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "services.html"
text = path.read_text(encoding="utf-8")
had_trailing_newline = text.endswith("\n")

replacements = [
    ("24?48 hours", "24\u201348 hours"),
    (
        '<a href="mobile-cardiac-telemetry-mct.html">MCT ? Mobile\n               Telemetry</a>',
        '<a href="mobile-cardiac-telemetry-mct.html">MCT \u2014 Mobile Telemetry</a>',
    ),
    ("Mobile Cardiac Telemetry (MCT) ? delivering", "Mobile Cardiac Telemetry (MCT) \u2014 delivering"),
    ("monitoring center ? no manual", "monitoring center \u2014 no manual"),
    ("ECG data ? no batch", "ECG data \u2014 no batch"),
    ("Enroll in Web Portal ? Hook Up ? Disconnect", "Enroll in Web Portal \u2192 Hook Up \u2192 Disconnect"),
    ("upon return ? no downtime", "upon return \u2014 no downtime"),
    ("asymptomatic?with", "asymptomatic\u2014with"),
    ("stamp?ready", "stamp\u2014ready"),
    ("Actually Wear ? The S-Patch", "Actually Wear \u2014 The S-Patch"),
    ("(IP55)?with", "(IP55)\u2014with"),
    ("data ? even in rural", "data \u2014 even in rural"),
    ("patients ? if it is not", "patients \u2014 if it is not"),
    ("isn?t the right fit, we?ll take everything back?no hassle", "isn\u2019t the right fit, we\u2019ll take everything back\u2014no hassle"),
    ("Talk to our team ?", "Talk to our team \u2192"),
    ('<p class="figma-footer__copy">? <span id="footer-year"', '<p class="figma-footer__copy">\u00a9 <span id="footer-year"'),
]

for old, new in replacements:
    text = text.replace(old, new)

out = []
for line in text.splitlines():
    if line.strip() == "?":
        indent = line[: len(line) - len(line.lstrip())]
        out.append(f"{indent}\u00b7")
    else:
        out.append(line)
text = "\n".join(out) + ("\n" if had_trailing_newline else "")

path.write_text(text, encoding="utf-8", newline="\n")

remaining = [
    (i, l)
    for i, l in enumerate(text.splitlines(), 1)
    if l.strip() == "?" or "24?48" in l or "MCT ?" in l or "isn?t" in l
]
print("Fixed services.html")
if remaining:
    print("Still suspicious:")
    for i, l in remaining[:20]:
        print(f"  {i}: {l.strip()[:80]}")
else:
    print("No obvious ? corruption left")
