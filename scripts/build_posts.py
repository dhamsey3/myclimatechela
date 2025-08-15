import re, html, textwrap, time, datetime, json, pathlib, sys
import feedparser, requests

FEED = "https://medium.com/feed/@myclimatedefinition"
out = pathlib.Path("public/posts.json")
out.parent.mkdir(parents=True, exist_ok=True)

def clean(s): return html.unescape(re.sub("<.*?>","", s or ""))
def to_iso(ts):
    if not ts: return ""
    try:
        return datetime.datetime.fromtimestamp(time.mktime(ts), datetime.timezone.utc).isoformat()
    except Exception:
        return ""

def extract_image(entry):
    if entry.get("media_thumbnail"):
        u = entry["media_thumbnail"][0].get("url")
        if u: return u
    if entry.get("media_content"):
        u = entry["media_content"][0].get("url")
        if u: return u
    blob = entry.get("summary","")
    for c in entry.get("content", []):
        blob += " " + c.get("value","")
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', blob, re.I)
    return m.group(1) if m else None

headers = {"User-Agent": "Mozilla/5.0"}
items = []
try:
    r = requests.get(FEED, headers=headers, timeout=30)
    r.raise_for_status()
    feed = feedparser.parse(r.content)
    for e in getattr(feed, "entries", []):
        items.append({
            "title": e.get("title","Untitled"),
            "permalink": e.get("link","#"),
            "external_url": e.get("link","#"),
            "date": to_iso(e.get("published_parsed")),
            "summary": textwrap.shorten(clean(e.get("summary","")), 220),
            "image": extract_image(e),
        })
except Exception as e:
    print(f"ERROR fetching feed: {e}", file=sys.stderr)

out.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8")
print(f"Wrote {len(items)} posts to {out}")
