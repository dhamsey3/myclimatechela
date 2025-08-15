from PIL import Image, ImageColor, ImageDraw
import pathlib, sys

base = pathlib.Path("public")
imgd = base / "img"
imgd.mkdir(parents=True, exist_ok=True)

logo = imgd / "logo.png"
if not logo.exists():
    print("No public/img/logo.png found; skipping icon generation.")
    sys.exit(0)

THEME_BG = "#0f172a"
ICON_SIZES = [192, 512]
APPLE_SIZE = 180
OG_W, OG_H = 1200, 630

src = Image.open(logo).convert("RGBA")

def on_canvas(w, h, scale=0.66, bg=THEME_BG):
    c = Image.new("RGBA", (w, h), ImageColor.getrgb(bg) + (255,))
    r = src.copy()
    target = int(min(w, h) * scale)
    ratio = src.width / src.height
    tw = int(target * ratio); th = target
    if tw > int(w * scale):
        tw = int(w * scale); th = int(tw / ratio)
    r.thumbnail((tw, th), Image.LANCZOS)
    c.alpha_composite(r, ((w - r.width) // 2, (h - r.height) // 2))
    return c

# PWA icons
for s in ICON_SIZES:
    on_canvas(s, s).save(imgd / f"icon-{s}.png")

# Apple touch icon
on_canvas(APPLE_SIZE, APPLE_SIZE).convert("RGB").save(imgd / "apple-touch-icon.png")

# Favicons
base512 = on_canvas(512, 512)
base512.save(imgd / "favicon-512.png")
base512.resize((32, 32), Image.LANCZOS).save(imgd / "favicon-32.png")
base512.resize((16, 16), Image.LANCZOS).save(imgd / "favicon-16.png")
base512.save(imgd / "favicon.ico", sizes=[(16,16),(32,32),(48,48),(64,64)])

# Open Graph image
og = on_canvas(OG_W, OG_H, scale=0.45)
d = ImageDraw.Draw(og)
caption = "My Climate Definition"
bbox = d.textbbox((0, 0), caption)
tw = bbox[2] - bbox[0]
d.text(((OG_W - tw) // 2, OG_H - 60), caption, fill=(255, 255, 255, 230))
og.convert("RGB").save(imgd / "og.png", quality=92)

print("Generated: icon-192.png, icon-512.png, apple-touch-icon.png, favicon.{ico,16,32}, og.png")
