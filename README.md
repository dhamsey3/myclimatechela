# My Climate Definition

The website for [My Climate Definition](https://myclimatedefinition.org), a climate blog published on [Medium](https://medium.com/@myclimatedefinition). The homepage shows the latest Medium stories, and the site rebuilds itself from the Medium feed twice a day.

## How it works

- **App:** React 18 and TypeScript, built with Vite and styled with Tailwind CSS (`src/`). Routes: `/`, `/about` and `/contact`.
- **Static pages:** everything in `public/` is copied into the build unchanged: the HTML pages, post previews, CSS, service worker and web manifest.
- **Deploy:** [`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every push to `main`, every 12 hours and on demand. Each run:
  1. Fetches the Medium RSS feed and writes `public/posts.json` (`scripts/build_posts.py`).
  2. Generates icons, the web manifest, `sitemap.xml` and `robots.txt` (`scripts/gen_*.py`).
  3. Type-checks and builds the site into `dist/` (`npm run build`).
  4. Adds a `404.html` for client-side routes and the `CNAME`, then deploys `dist/` to GitHub Pages at `myclimatedefinition.org`.

`dist/` in the repository is an old build; the workflow rebuilds it on every deploy.

## Run it locally

Requirements: Node.js 22 and Python 3.

```bash
npm ci
npm run dev       # http://localhost:3000
npm test          # Vitest
npm run build     # type-check and build into dist/
```

To pull the latest posts from Medium:

```bash
python3 -m pip install -r requirements.txt
npm run sync:posts
```

## Keeping the Medium sync running

GitHub turns off scheduled workflows in a public repository after 60 days without activity. If new stories stop appearing on the site, open **Actions → Build & Deploy (React + Medium)** and click **Enable workflow**, or run it once with **Run workflow**.

## Layout

```text
src/                 React app: pages, components, post loading (lib/posts.ts)
public/              static pages and assets, copied into the build
scripts/             Medium sync, icons, manifest, sitemap, post previews
config/site.json     newsletter form target used by scripts/generate_previews.py
.github/workflows/   build and deploy to GitHub Pages
```

## License

See [LICENSE](LICENSE).
