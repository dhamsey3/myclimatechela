#!/usr/bin/env python3
"""
Simple image processing utility using Pillow.
Usage:
  python3 scripts/make_images.py input.jpg output_basename
Produces files in the same directory as output_basename with sizes:
  - {basename}-480.jpg
  - {basename}-900.jpg
  - {basename}-1600.jpg
  - same names in .webp
  - {basename}-blur.jpg (very small, blurred placeholder)

Requires: Pillow (already in requirements.txt)
"""
import sys, os
from PIL import Image, ImageFilter

SIZES = [480, 900, 1600]
QUALITY = 80
WEBP_QUALITY = 80


def ensure_dir(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)


def make_variants(src_path, out_basename):
    img = Image.open(src_path).convert('RGB')
    out_dir = os.path.dirname(out_basename) or os.getcwd()
    base = os.path.splitext(os.path.basename(out_basename))[0]

    results = {}

    for w in SIZES:
        # maintain aspect ratio
        ratio = w / img.width
        new_h = int(img.height * ratio)
        resized = img.resize((w, new_h), Image.LANCZOS)
        jpg_path = os.path.join(out_dir, f"{base}-{w}.jpg")
        webp_path = os.path.join(out_dir, f"{base}-{w}.webp")
        resized.save(jpg_path, 'JPEG', quality=QUALITY, optimize=True)
        resized.save(webp_path, 'WEBP', quality=WEBP_QUALITY, method=6)
        results[w] = (jpg_path, webp_path)

    # small blurred placeholder
    tiny = img.resize((40, int(img.height * (40 / img.width))), Image.LANCZOS)
    tiny = tiny.filter(ImageFilter.GaussianBlur(radius=6))
    blur_path = os.path.join(out_dir, f"{base}-blur.jpg")
    tiny.save(blur_path, 'JPEG', quality=40, optimize=True)
    results['blur'] = blur_path

    print(f"[make_images] Wrote variants for {src_path} -> {out_dir}")
    return results


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: make_images.py input.jpg output_basename")
        print("Example: python3 scripts/make_images.py public/img/about-src.jpg public/img/about-hero")
        sys.exit(1)
    src = sys.argv[1]
    outbase = sys.argv[2]
    if not os.path.exists(src):
        print("Source not found:", src)
        sys.exit(2)
    make_variants(src, outbase)
