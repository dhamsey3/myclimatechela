#!/usr/bin/env python3
import argparse
import re, html, textwrap, time, datetime, json, pathlib, sys, random
import feedparser, requests

# Captions, headings and bylines are not part of a story's opening text.
NON_BODY_BLOCKS = re.compile(r"<(figure|figcaption|h[1-6])\b[^>]*>.*?</\1>", re.S | re.I)
PARAGRAPH = re.compile(r"<p\b[^>]*>(.*?)</p>", re.S | re.I)
BYLINE = re.compile(r"^(written )?by\s+[^.!?]{1,60}$", re.I)

def clean(s):
    """Strip tags, leaving a space where each one was so words don't run together."""
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or "")))
    return re.sub(r" ([.,;:!?)])", r"\1", text).strip()

def excerpt_text(markup):
    """Opening text of a story for its preview card."""
    markup = NON_BODY_BLOCKS.sub(" ", markup or "")
    paragraphs = [clean(p) for p in PARAGRAPH.findall(markup)]
    paragraphs = [p for p in paragraphs if p and not BYLINE.match(p)]
    return " ".join(paragraphs) if paragraphs else clean(markup)

def entry_markup(entry):
    """Full story HTML: Medium sends it as content:encoded, other feeds as the summary."""
    for block in entry.get("content") or []:
        if block.get("value"):
            return block["value"]
    return entry.get("summary", "") or ""

def byline_name(markup):
    """Writer named in a "By ..." line before the story's first paragraph, if any."""
    for paragraph in PARAGRAPH.findall(NON_BODY_BLOCKS.sub(" ", markup or "")):
        text = clean(paragraph)
        if not text:
            continue
        if BYLINE.match(text):
            return re.sub(r"^(written )?by\s+", "", text, flags=re.I).strip()
        return ""
    return ""

def reading_minutes(markup, words_per_minute=230):
    words = len(clean(markup).split())
    return max(1, round(words / words_per_minute)) if words else 0

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
                print(
                    f"[build_posts] Got {r.status_code}. Backing off {wait:.1f}s (attempt {i}/{attempts})...",
                    file=sys.stderr,
                )
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.content
        except Exception as e:
            last_exc = e
            wait = min(60, base_delay * i + random.uniform(0, 1.5))
            print(
                f"[build_posts] Fetch failed: {e} — retrying in {wait:.1f}s (attempt {i}/{attempts})",
                file=sys.stderr,
            )
            time.sleep(wait)
    if last_exc:
        raise last_exc
    raise RuntimeError("Unknown fetch failure")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--feed",
        default="https://medium.com/feed/@myclimatedefinition",
        help="RSS feed URL",
    )
    parser.add_argument(
        "--out",
        default="public/posts.json",
        help="Output file path",
    )
    args = parser.parse_args()

    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    items = []
    try:
        content = fetch_feed_with_retries(args.feed, headers)
        feed = feedparser.parse(content)
        for e in getattr(feed, "entries", []):
            link = e.get("link", "#")
            markup = entry_markup(e)
            summary_txt = textwrap.shorten(excerpt_text(markup), 220)
            items.append(
                {
                    "title": e.get("title", "Untitled"),
                    "permalink": link,
                    "external_url": link,
                    "url": link,  # alias many frontends expect
                    "excerpt": summary_txt,  # alias of summary
                    "summary": summary_txt,
                    "date": to_iso(
                        e.get("published_parsed") or e.get("updated_parsed")
                    ),
                    "image": extract_image(e),
                    "tags": [t.get("term") for t in e.get("tags", []) if t.get("term")],
                    "author": byline_name(markup),
                    "reading_minutes": reading_minutes(markup),
                }
            )

    except requests.HTTPError as e:
        # If we hit a hard HTTP error (e.g., 429) after retries, preserve the last good file
        print(f"[build_posts] ERROR fetching feed: {e}", file=sys.stderr)

    except Exception as e:
        print(f"[build_posts] ERROR: {e}", file=sys.stderr)

    # If nothing fetched, try to keep previous file to avoid empty homepage
    if not items:
        if out.exists() and out.stat().st_size > 2:
            print(
                "[build_posts] No new items; keeping previous posts.json",
                file=sys.stderr,
            )
            # Touch file to update mtime so downstream steps see it's present
            ts = json.loads(out.read_text(encoding="utf-8"))
            print(
                f"[build_posts] Previous posts count: {len(ts) if isinstance(ts, list) else 'unknown'}"
            )
            sys.exit(0)
        else:
            # Absolute fallback: write empty list (homepage will show no posts, but build won’t crash)
            out.write_text("[]", encoding="utf-8")
            print(f"[build_posts] Wrote 0 posts to {out}")
            sys.exit(0)

    # Write fresh file
    out.write_text(
        json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[build_posts] Wrote {len(items)} posts to {out}")


if __name__ == "__main__":
    main()
