from pathlib import Path
t = Path(r"C:\Users\ARFA TECH\Specialized-med-new\services.html").read_text(encoding="utf-8")
for needle in ["24", "MCT", "Ambulatory", "copyright", "Portal"]:
    for i, line in enumerate(t.splitlines(), 1):
        if needle in line and ("hours" in line or "Mobile" in line or "Monitoring" in line or "footer" in line or "Portal" in line):
            if "?" in line or "\u2013" in line or "\u2014" in line or "\u00b7" in line or "\u2192" in line or "\u00a9" in line:
                print(i, [hex(ord(c)) for c in line if ord(c) > 127], line.strip()[:100])
