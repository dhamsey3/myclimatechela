from pathlib import Path

p = Path("public/index.html")
html = p.read_text(encoding="utf-8")

snippet = """\
  <meta name="description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
  <link rel="canonical" href="https://myclimatedefinition.org/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="My Climate Definition">
  <meta property="og:description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
  <meta property="og:url" content="https://myclimatedefinition.org/">
  <meta property="og:image" content="https://myclimatedefinition.org/img/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="My Climate Definition">
  <meta name="twitter:description" content="Stories, definitions, and experiments in sustainability — auto-synced from Medium.">
  <meta name="twitter:image" content="https://myclimatedefinition.org/img/og.png">
  <link rel="icon" href="/img/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" href="/img/favicon-32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/img/favicon-16.png" sizes="16x16">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#0f172a">"""

markers = ["og:image", "manifest.webmanifest", "apple-touch-icon", "favicon.ico"]

if not any(m in html for m in markers):
    if "</head>" in html:
        html = html.replace("</head>", snippet + "\n</head>")
        p.write_text(html, encoding="utf-8")
        print("Injected head tags.")
    else:
        print("No </head> found; skipped injection.")
else:
    print("Head tags already present; no changes.")
