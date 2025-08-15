````markdown
# My Climate Definition — Static Site

A fast, static website that auto-syncs your latest Medium posts to a clean, responsive homepage. Built with plain **HTML/CSS/JS** and deployed to **GitHub Pages** via **Actions**.

---

## Features

- **Static & fast**: vanilla HTML/CSS/JS (no framework)
- **Auto Medium sync**: GitHub Action fetches your Medium RSS and writes `public/posts.json`
- **Responsive UI**: hero, image slider, and paginated post cards
- **Accessibility**: keyboard controls for the slider, alt text, ARIA labels
- **Custom domain ready**: ships `CNAME` and `.nojekyll`

---

## Project Structure

```text
.
├─ public/
│  ├─ index.html            # Main page (header, hero, slider, posts list)
│  ├─ css/
│  │  └─ style.css          # Styles (incl. logo sizing & brand text)
│  ├─ js/
│  │  └─ main.js            # Slider, posts rendering, UX helpers
│  ├─ img/
│  │  ├─ logo.png           # Your logo (required)
│  │  └─ logo@2x.png        # Optional retina logo (2× height)
│  ├─ posts.json            # Generated from Medium RSS by the workflow
│  ├─ .nojekyll             # Disable Jekyll on GitHub Pages
│  └─ CNAME                 # (Optional) custom domain (e.g. myclimatedefinition.org)
├─ .github/
│  └─ workflows/
│     └─ pages.yml          # Build & deploy workflow (plus Medium sync)
└─ requirements.txt         # feedparser + requests (for the workflow job)
````

---

## Getting Started (Local)

1. **Clone**

```bash
git clone <YOUR-REPO-URL>.git
cd <YOUR-REPO-NAME>
```

2. **Serve the `public/` folder**

```bash
cd public
# Option A (Python 3)
python -m http.server 8080
# then open http://localhost:8080

# Option B (Node)
# npx serve . -l 8080
```

> You *can* open `public/index.html` directly, but using a local server behaves closer to production.

---

## Deployment (GitHub Pages + Actions)

* The workflow at `.github/workflows/pages.yml`:

  * Installs deps from `requirements.txt` (`feedparser`, `requests`)
  * Fetches your Medium RSS and generates `public/posts.json`
  * Uploads the **`public/`** directory as the Pages artifact
  * Deploys to GitHub Pages (uses `public/CNAME` if present)

**Enable Pages**: Repo **Settings → Pages → Build and deployment** = **GitHub Actions**.

---

## Customization

### 1) Site copy & links

* **Title/SEO** in `public/index.html`:

  ```html
  <title>My Climate Definition</title>
  ```
* **Hero text**: edit the `<h1>` and paragraph in the hero section.
* **Social links**: update the URLs in the footer.

### 2) Logo & brand text

* Put your logo at:

  ```
  public/img/logo.png
  ```
* (Optional retina) add:

  ```
  public/img/logo@2x.png
  ```
* The header shows the **logo + brand text**. To change the wordmark, edit in `public/index.html`:

  ```html
  <span class="brand-text">My Climate Definition</span>
  ```
* Tweak sizing in `public/css/style.css`:

  ```css
  .logo img{
    height: clamp(40px, 5vw, 60px);
    background: #0f172a; /* dark chip so light logos pop */
    padding: 8px 12px;
    border-radius: 12px;
  }
  .logo .brand-text{
    font-weight: 800;
    font-size: clamp(18px, 2.4vw, 22px);
  }
  ```

### 3) Medium feed account

* The workflow pulls from:

  ```
  https://medium.com/feed/@myclimatedefinition
  ```
* To change accounts, edit the `FEED` URL in the **“Generate posts.json from Medium RSS”** step inside `pages.yml`.

---

## How the Medium Sync Works

On **push** (and every **6 hours** via cron), the Action:

1. Fetches your RSS with a browser-like user agent
2. Parses entries with `feedparser`
3. Extracts title, link, date, summary, and best-guess image URL
4. Writes them into `public/posts.json`

Then `public/js/main.js`:

* Loads `posts.json`
* Renders **3 posts per page**
* Adds an **Older »** button for pagination

---

## Troubleshooting

**Logo not visible**

* Confirm it deploys by visiting:

  ```
  https://<your-domain>/img/logo.png
  ```
* If your logo is white/light, the CSS “chip” (`background: #0f172a`) ensures contrast.
* Prefer a transparent PNG for best results.
* To remove the chip, delete `background`, `padding`, and `border-radius` from `.logo img`.

**Logo blurry on retina**

* Add `public/img/logo@2x.png` (2× the CSS height).
* HTML already includes:

  ```html
  srcset="/img/logo@2x.png 2x, /img/logo.png 1x"
  ```
* If `logo@2x.png` is missing, a small inline script in `index.html` removes `srcset` so `logo.png` still shows.

**Footer year is blank**

* Means `main.js` didn’t load/run. Ensure:

  ```html
  <script src="/js/main.js" defer></script>
  ```

  and that `public/js/main.js` exists.

**Changes not appearing after deploy**

* Hard-refresh (Shift/Ctrl + Reload).
* Inspect the Actions logs; optionally add this debug step to print the start of `index.html`:

  ```yaml
  - name: Debug: show first lines of index.html
    run: awk 'NR<=60{printf "%03d| %s\n", NR, $0}' public/index.html
  ```

---

## Development Tips

* Use **absolute paths** for production assets (e.g. `/css/style.css`, `/js/main.js`, `/img/logo.png`) — best for Pages + custom domains.
* For quick local checks, relative paths also work if you serve from `public/`.

---

## Requirements

`requirements.txt` (used by the workflow job):

```
feedparser
requests
```

---

## License

MIT (or your choice). Add a `LICENSE` file to specify otherwise.

```
::contentReference[oaicite:0]{index=0}
```
