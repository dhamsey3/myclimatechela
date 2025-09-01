#!/usr/bin/env python3
import re, html, textwrap, time, datetime, json, pathlib, sys, random
import feedparser, requests

FEED = "https://medium.com/feed/@myclimatedefinition"
out = pathlib.Path("public/posts.json")
out.parent.mkdir(parents=True, exist_ok=True)

def clean(s):
    return html.unescape(re.sub("<.*?>","", s or "")).strip()

def to_iso(ts):
    if not ts: return ""
    try:
        return datetime.datetime.fromtimestamp(
            time.mktime(ts), datetime.timezone.utc
        ).isoformat()
    except Exception:
        return ""

def extract_image(entry):
    if entry.get("media_thumbnail"):
        u = entry["media_thumbnail"][0].get("url")
        if u: return u
    if entry.get("media_content"):
        u = entry["media_content"][0].get("url")
        if u: return u
    blob = entry.get("summary","") or ""
    for c in entry.get("content", []):
        blob += " " + (c.get("value","") or "")
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', blob, re.I)
    return m.group(1) if m else None

UA = "MyClimateDefinitionBot/1.0 (+https://myclimatedefinition.org)"
headers = {
    "User-Agent": UA,
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
}

def fetch_feed_with_retries(url, headers, attempts=5, base_delay=3):
    last_exc = None
    for i in range(1, attempts + 1):
        try:
            r = requests.get(url, headers=headers, timeout=30)
            # Respect Retry-After on 429/503 if present
            if r.status_code in (429, 503):
                retry_after = r.headers.get("Retry-After")
                if retry_after:
                    try:
                        wait = int(retry_after)
                    except ValueError:
                        wait = base_delay * i
                else:
                    wait = base_delay * i
                jitter = random.uniform(0, 1.5)
                wait = min(60, wait + jitter)
                print(f"[build_posts] Got {r.status_code}. Backing off {wait:.1f}s (attempt {i}/{attempts})...", file=sys.stderr)
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.content
        except Exception as e:
            last_exc = e
            wait = min(60, base_delay * i + random.uniform(0, 1.5))
            print(f"[build_posts] Fetch failed: {e} — retrying in {wait:.1f}s (attempt {i}/{attempts})", file=sys.stderr)
            time.sleep(wait)
    if last_exc:
        raise last_exc
    raise RuntimeError("Unknown fetch failure")

items = []
try:
    content = fetch_feed_with_retries(FEED, headers)
    feed = feedparser.parse(content)
    for e in getattr(feed, "entries", []):
        link = e.get("link", "#")
        summary_txt = textwrap.shorten(clean(e.get("summary","")), 220)
        items.append({
            "title": e.get("title","Untitled"),
            "permalink": link,
            "external_url": link,
            "url": link,                 # alias many frontends expect
            "excerpt": summary_txt,      # alias of summary
            "summary": summary_txt,
            "date": to_iso(e.get("published_parsed") or e.get("updated_parsed")),
            "image": extract_image(e),
        })

except requests.HTTPError as e:
    # If we hit a hard HTTP error (e.g., 429) after retries, preserve the last good file
    print(f"[build_posts] ERROR fetching feed: {e}", file=sys.stderr)

except Exception as e:
    print(f"[build_posts] ERROR: {e}", file=sys.stderr)

# If nothing fetched, try to keep previous file to avoid empty homepage
if not items:
    if out.exists() and out.stat().st_size > 2:
        print("[build_posts] No new items; keeping previous posts.json", file=sys.stderr)
        # Touch file to update mtime so downstream steps see it's present
        ts = json.loads(out.read_text(encoding="utf-8"))
        print(f"[build_posts] Previous posts count: {len(ts) if isinstance(ts, list) else 'unknown'}")
        sys.exit(0)
    else:
        # Absolute fallback: write empty list (homepage will show no posts, but build won’t crash)
        out.write_text("[]", encoding="utf-8")
        print(f"[build_posts] Wrote 0 posts to {out}")
        sys.exit(0)

# Write fresh file
out.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"[build_posts] Wrote {len(items)} posts to {out}")
