from pathlib import Path
m = Path("public/manifest.webmanifest")
if not m.exists():
    m.write_text('''{
  "name": "My Climate Definition",
  "short_name": "ClimateDef",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "icons": [
    { "src": "/img/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/img/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}''', encoding="utf-8")
    print("Wrote manifest.webmanifest")
else:
    print("manifest.webmanifest already exists")
