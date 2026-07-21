#!/usr/bin/env python3
"""Generate compressed WebP variants for Lighthouse-critical images."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

JOBS = [
    ("images/specialized-medical-spatch-hero.jpg", 1200, 82),
    ("images/figma-services/live-streaming-ecg.jpg", 960, 80),
    ("images/figma-services/patient-friendly.jpg", 720, 80),
    ("images/figma-assets/Rectangle 34.png", 738, 82),
]


def optimize(path: Path, max_width: int, quality: int) -> Path:
    img = Image.open(path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    elif img.mode == "RGBA":
        img = img.convert("RGB")

    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, max(int(img.height * ratio), 1)), Image.Resampling.LANCZOS)

    out = path.with_suffix(".webp")
    img.save(out, "WEBP", quality=quality, method=6)
    before = path.stat().st_size
    after = out.stat().st_size
    print(f"{out.relative_to(ROOT)}  {before // 1024} KiB -> {after // 1024} KiB")
    return out


if __name__ == "__main__":
    for rel, width, q in JOBS:
        src = ROOT / rel
        if not src.exists():
            print(f"skip missing {rel}")
            continue
        optimize(src, width, q)
