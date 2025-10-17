#!/usr/bin/env python3
"""Generate preview HTML pages for posts listed in public/posts.json.

Creates files at public/posts/<slug>/index.html with a simple template that
includes canonical original_url, a subscribe CTA, and related-posts by tag.

Safe to run multiple times; overwrites existing preview files.
"""
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS_JSON = ROOT / 'public' / 'posts.json'
OUT_DIR = ROOT / 'public' / 'posts'
SITE_CONFIG = ROOT / 'config' / 'site.json'

TEMPLATE = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <link rel="stylesheet" href="/css/style.css" />
  <link rel="stylesheet" href="/css/modern.css" />
  {canonical}
</head>
<body class="mc-theme-v2">
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/" aria-label="My Climate Definition">
        <img id="logoImg" class="header-logo-img" src="/img/logo.png" alt="logo">
        <span class="brand-text">My Climate Definition</span>
      </a>
      <nav id="site-nav" class="nav" aria-hidden="false">
        <a href="/">Home</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <article class="card">
      <header class="page-hero">
        <h1>{title}</h1>
        <p class="lead">{summary}</p>
        <p class="muted-xs">Published: {date}</p>
      </header>

      <section class="stack">
        <p>{excerpt}</p>
        <p class="muted">Summary: {summary}</p>
        <p><a class="btn btn-primary" href="{original_url}" target="_blank" rel="noopener">Read full article on Medium →</a></p>
      </section>

      <section class="stack">
        <h3>Related</h3>
        <div class="mc-grid">
          {related_html}
        </div>
      </section>

      <section class="mc-cta-band">
        <div>
          <strong>Get short, practical updates</strong>
          <p class="muted">Subscribe to small experiments and notes.</p>
        </div>
        <form class="mc-news" action="{subscribe_action}" method="POST">
          <input name="email" type="email" placeholder="you@example.com" required>
          <input type="hidden" name="_captcha" value="false">
          {subscribe_next}
          <button class="btn btn-primary" type="submit">Subscribe</button>
        </form>
      </section>

    </article>
  </main>

  <footer class="site-footer">
    <div class="container footer-bottom">
      <p>© <span id="year"></span> My Climate Definition</p>
      <a href="/" class="backtop">Back to home</a>
    </div>
  </footer>

  <script src="/js/main.js" defer></script>
  <script src="/js/ui-enhancements.js" defer></script>
</body>
</html>
'''


def slugify(s):
    s = s.strip().lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'-+', '-', s)
    return s.strip('-') or 'post'


def render_related(post, all_posts, limit=3):
    tags = set([t.lower() for t in (post.get('tags') or [])])
    if not tags:
        return ''
    related = []
    for p in all_posts:
        if p is post: continue
        ptags = set([t.lower() for t in (p.get('tags') or [])])
        if tags & ptags:
            related.append(p)
    related = related[:limit]
    html = ''
    for r in related:
        url = r.get('url') or '#'
        title = r.get('title','Untitled')
        image = r.get('image','/img/slide1.png')
        html += f'<a class="mc-card" href="{url}"><img class="mc-thumb" src="{image}" alt=""><h3>{title}</h3></a>'
    return html


def main():
  if not POSTS_JSON.exists():
    print('posts.json not found at', POSTS_JSON)
    return

  # Load posts
  with open(POSTS_JSON, 'r', encoding='utf-8') as f:
    posts = json.load(f)

  # Load site config if present
  site_cfg = {}
  if SITE_CONFIG.exists():
    try:
      with open(SITE_CONFIG, 'r', encoding='utf-8') as sf:
        site_cfg = json.load(sf)
    except Exception:
      site_cfg = {}

  subscribe_action = site_cfg.get('subscribe_action', '#')
  subscribe_next_val = site_cfg.get('subscribe_next')

  OUT_DIR.mkdir(parents=True, exist_ok=True)

  for p in posts:
    title = p.get('title', 'Untitled')
    summary = p.get('summary', '')
    date = p.get('date', '')
    original = p.get('original_url') or p.get('url') or ''
    # link to local path
    local = p.get('url') or '#'
    excerpt = p.get('summary') or p.get('excerpt') or ''
    slug = slugify(title)
    outdir = OUT_DIR / slug
    outdir.mkdir(parents=True, exist_ok=True)

    canonical = f'<link rel="canonical" href="{original}" />' if original else ''

    subscribe_next = ''
    if subscribe_next_val:
      subscribe_next = f'<input type="hidden" name="_next" value="{subscribe_next_val}">'

    related_html = render_related(p, posts)

    html = TEMPLATE.format(
      title=title,
      summary=summary,
      date=date,
      original_url=original,
      excerpt=excerpt,
      canonical=canonical,
      related_html=related_html,
      subscribe_action=subscribe_action,
      subscribe_next=subscribe_next,
    )

    outfile = outdir / 'index.html'
    with open(outfile, 'w', encoding='utf-8') as fo:
      fo.write(html)
    print('Wrote', outfile)


if __name__ == '__main__':
    main()
