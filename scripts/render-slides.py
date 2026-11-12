"""Render từng trang PDF khóa học thành WebP trong public/slides.

Chạy: python scripts/render-slides.py
"""
import io
import json
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "Data Science_Machine Learning course.pdf"
OUT = ROOT / "public" / "slides"
WIDTH = 1280
QUALITY = 80

OUT.mkdir(parents=True, exist_ok=True)
doc = fitz.open(PDF)
total = len(doc)
for i, page in enumerate(doc, start=1):
    zoom = WIDTH / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    img.save(OUT / f"slide-{i:03d}.webp", "WEBP", quality=QUALITY, method=6)
    if i % 20 == 0 or i == total:
        print(f"{i}/{total}")

ratio = doc[0].rect.height / doc[0].rect.width
(OUT / "manifest.json").write_text(
    json.dumps({"total": total, "width": WIDTH, "height": round(WIDTH * ratio), "pattern": "slide-{n:03d}.webp"}, indent=2),
    encoding="utf-8",
)
