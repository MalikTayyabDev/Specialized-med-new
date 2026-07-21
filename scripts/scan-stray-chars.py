import glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for f in glob.glob(str(ROOT / "**/*.html"), recursive=True):
    if "partials" in f or "faq-accordion-fragment" in f:
        continue
    t = Path(f).read_text(encoding="utf-8", errors="replace")
    for i, line in enumerate(t.splitlines(), 1):
        if "site-header site-header--figma" in line and not line.lstrip().startswith("<header"):
            print(Path(f).relative_to(ROOT), i, repr(line[:60]))
        if "site-footer site-footer--figma" in line and not line.lstrip().startswith("<footer"):
            print(Path(f).relative_to(ROOT), i, repr(line[:60]))
