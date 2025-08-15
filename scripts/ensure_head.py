from pathlib import Path
import datetime, re

p = Path("public/index.html")
html = p.read_text(encoding="utf-8")

build_tag = datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z"

block = f"""<!-- BEGIN AUTO-HEAD -->
<meta name="x-build-tag" content="{build_tag}">
<meta name="description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
<link rel="canonical" href="https://myclimatedefinition.org/">

<!-- Open Graph / Twitter -->
<meta property="og:type" content="website">
<meta property="og:title" content="My Climate Definition">
<meta property="og:description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
<meta property="og:url" content="https://myclimatedefinition.org/">
<meta property="og:image" content="https://myclimatedefinition.org/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="My Climate Definition">
<meta name="twitter:description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
<meta name="twitter:image" content="https://myclimatedefinition.org/img/og.png">

<!-- Icons / Manifest -->
<link rel="icon" href="/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/img/favicon-32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/img/favicon-16.png" sizes="16x16">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0f172a">
<!-- END AUTO-HEAD -->"""

# Remove any previous AUTO-HEAD block (idempotent)
html = re.sub(r"<!-- BEGIN AUTO-HEAD -->.*?<!-- END AUTO-HEAD -->", "", html, flags=re.S)

# Insert fresh block just before </head>
if "</head>" in html:
    html = html.replace("</head>", block + "\n</head>")
    p.write_text(html, encoding="utf-8")
    print("Injected AUTO-HEAD block with build tag:", build_tag)
else:
    print("No </head> tag found; skipped injection.")
