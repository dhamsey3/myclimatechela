import json, pathlib, datetime

base = "https://myclimatedefinition.org"
pub = pathlib.Path("public")
posts = []
try:
    posts = json.loads(pub.joinpath("posts.json").read_text("utf-8"))
except Exception:
    pass

urls = [f"{base}/"]
for p in posts:
    u = p.get("permalink") or p.get("external_url")
    if u and u.startswith("http"):
        urls.append(u)

now = datetime.date.today().isoformat()
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in sorted(set(urls)):
    lines += ["<url>", f"<loc>{u}</loc>", f"<lastmod>{now}</lastmod>", "</url>"]
lines += ["</urlset>"]
pub.joinpath("sitemap.xml").write_text("\n".join(lines), "utf-8")
pub.joinpath("robots.txt").write_text(
    "User-agent: *\nAllow: /\nSitemap: " + base + "/sitemap.xml\n", "utf-8"
)
print("Wrote sitemap.xml and robots.txt")
