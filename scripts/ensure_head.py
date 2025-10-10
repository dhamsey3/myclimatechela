from pathlib import Path
import datetime, re

p = Path("public/index.html")
html = p.read_text(encoding="utf-8")

build_tag = datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z"

# Keep this block minimal to avoid duplicating existing head tags in index.html
block = f"""<!-- BEGIN AUTO-HEAD -->
<meta name=\"x-build-tag\" content=\"{build_tag}\">
<!-- END AUTO-HEAD -->"""

# Remove any previous AUTO-HEAD block (idempotent)
html = re.sub(r"<!-- BEGIN AUTO-HEAD -->.*?<!-- END AUTO-HEAD -->", "", html, flags=re.S)

# Insert fresh block just before </head>
if "</head>" in html:
    html = html.replace("</head>", block + "\n</head>")
    p.write_text(html, encoding="utf-8")
    print("Injected build tag:", build_tag)
else:
    print("No </head> tag found; skipped injection.")
