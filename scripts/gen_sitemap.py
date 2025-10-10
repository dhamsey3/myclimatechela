import json, pathlib, datetime, urllib.parse

base = "https://myclimatedefinition.org"
pub = pathlib.Path("public")
posts = []
try:
    posts = json.loads(pub.joinpath("posts.json").read_text("utf-8"))
except Exception:
    pass

urls = [f"{base}/", f"{base}/about.html", f"{base}/contact.html"]

# Only include on-site absolute URLs to avoid leaking external Medium links into sitemap
def is_on_site(u: str) -> bool:
    try:
        parsed = urllib.parse.urlparse(u)
        return (parsed.scheme in ("http", "https")) and (parsed.netloc == urllib.parse.urlparse(base).netloc)
    except Exception:
        return False

for post in posts:
    # If posts.json ever includes site-hosted article URLs, include them; skip external links
    candidate = post.get("url") or post.get("permalink") or post.get("external_url")
    if isinstance(candidate, str) and is_on_site(candidate):
        urls.append(candidate)

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
