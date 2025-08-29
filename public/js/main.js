/* ========= Footer year (robust) ========= */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* ========= Auto-highlight active nav link ========= */
(() => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href]'));

  const normalize = (href) => {
    try {
      const u = new URL(href, location.origin);
      let p = u.pathname.replace(/index\.html?$/i, '');
      if (!p.endsWith('/')) p += '/';
      return p;
    } catch { return href; }
  };

  let current = location.pathname.replace(/index\.html?$/i, '');
  if (!current.endsWith('/')) current += '/';

  links.forEach(a => {
    const p = normalize(a.getAttribute('href'));
    const isMatch = (current === p) || (current.startsWith(p) && p !== '/');
    a.classList.toggle('active', !!isMatch);
  });
})();

/* ========= Slider (automatic, one at a time) ========= */
(function () {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track    = slider.querySelector('.slider-track');
  const slides   = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = slider.querySelector('.slider-dots');
  const prev     = slider.querySelector('.slider-btn.prev');
  const next     = slider.querySelector('.slider-btn.next');
  if (!track || !slides.length || !dotsWrap || !prev || !next) return;

  // Build dots
  dotsWrap.innerHTML = slides.map((_, i) =>
    `<button role="tab" aria-selected="${i===0}" aria-label="Go to slide ${i+1}" data-slide="${i}"></button>`
  ).join('');
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  let i = 0, n = slides.length, timer;

  function go(idx) {
    i = (idx + n) % n;
    track.style.transform = `translateX(${-i * 100}%)`;
    dots.forEach((d, k) => {
      d.classList.toggle('active', k === i);
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
      d.tabIndex = k === i ? 0 : -1;
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){ stop(); if (!prefersReduced) timer = setInterval(() => go(i + 1), 5000); }
  function stop(){ if (timer) clearInterval(timer); }

  prev.addEventListener('click', () => { go(i - 1); start(); }, { passive: true });
  next.addEventListener('click', () => { go(i + 1); start(); }, { passive: true });
  dots.forEach(d => d.addEventListener('click', () => { go(+d.dataset.slide); start(); }, { passive: true }));

  // Keyboard support (←/→)
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(i - 1); start(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); start(); }
  });

  slider.addEventListener('mouseenter', stop, { passive: true });
  slider.addEventListener('mouseleave', start, { passive: true });
  window.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  go(0); start();
})();

/* ========= Render posts from posts.json (robust path) ========= */
(async function () {
  const POSTS_PER_PAGE = 3;
  let page = 0, posts = [];

  const list  = document.getElementById('posts');
  const pager = document.getElementById('pager');
  const older = document.getElementById('older');
  if (!list || !pager || !older) return;

  // Try URLs that work at root and in subfolders
  const candidates = [
    new URL('./posts.json', window.location.href),
    new URL('posts.json', window.location.href),
    new URL('/posts.json', window.location.origin),
  ];
  candidates.forEach(u => u.searchParams.set('ts', Date.now())); // bust cache

  async function fetchFirstOk(urls) {
    for (const u of urls) {
      try {
        const res = await fetch(u.toString(), { cache: 'no-store' });
        if (!res.ok) { console.warn('[posts] Not OK:', u.toString(), res.status); continue; }
        const data = await res.json();
        if (!Array.isArray(data)) { console.warn('[posts] Not an array at', u.toString()); continue; }
        console.log('[posts] Loaded from', u.toString(), `(${data.length} items)`);
        return data;
      } catch (e) {
        console.warn('[posts] Fetch failed:', u.toString(), e);
      }
    }
    return null;
  }

  posts = await fetchFirstOk(candidates);

  if (!posts || !posts.length) {
    list.innerHTML = '<p style="color:#666">No posts yet. Check back soon.</p>';
    pager.hidden = true;
    return;
  }

  const dateFmt = new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'numeric' });
  const esc = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  function card(p) {
    const url = p.external_url || p.permalink || '#';
    const title = esc(p.title || 'Untitled');
    const img = p.image
      ? `<a class="hcard-media" href="${url}" target="_blank" rel="noopener nofollow">
           <img src="${p.image}" alt="${title}" loading="lazy">
         </a>`
      : `<a class="hcard-media placeholder" href="${url}" target="_blank" rel="noopener nofollow"><div></div></a>`;

    return `
      <article class="hcard">
        ${img}
        <div class="hcard-body">
          <h3 class="hcard-title"><a href="${url}" target="_blank" rel="noopener nofollow">${title}</a></h3>
          <small class="hcard-meta">${p.date ? dateFmt.format(new Date(p.date)) : ''}</small>
          <p class="hcard-text">${esc(p.summary || '')}</p>
          ${url && url !== '#' ? `<p><a class="btn" href="${url}" target="_blank" rel="noopener nofollow">Read on Medium →</a></p>` : ''}
        </div>
      </article>`;
  }

  function renderPage() {
    const start = page * POSTS_PER_PAGE;
    const slice = posts.slice(start, start + POSTS_PER_PAGE);
    if (!slice.length) { pager.hidden = true; return; }
    list.insertAdjacentHTML('beforeend', slice.map(card).join(''));
    page++;
    pager.hidden = !(page * POSTS_PER_PAGE < posts.length);
  }

  pager.hidden = posts.length <= POSTS_PER_PAGE;
  older.addEventListener('click', renderPage, { passive: true });
  renderPage();
})();

/* ========= Smooth back-to-top ========= */
(() => {
  const link = document.querySelector('.backtop');
  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ========= Retina safeguards for logos ========= */
(() => {
  function retinaGuard(id) {
    const img = document.getElementById(id);
    if (!img) return;
    const probe = new Image();
    probe.onerror = () => { img.removeAttribute('srcset'); };
    probe.src = '/img/logo@2x.png?ts=' + Date.now();
  }
  retinaGuard('logoImg');
  retinaGuard('footerLogoImg');
})();

/* ========= Contact form (progressive enhancement) ========= */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('[type="submit"]');
  const honeypot = form.querySelector('#website'); // hidden anti-spam

  const setStatus = (text, opts = {}) => {
    if (!status) return;
    status.textContent = text || '';
    if (opts.polite) status.setAttribute('aria-live', 'polite');
    if (opts.assertive) status.setAttribute('aria-live', 'assertive');
  };

  form.addEventListener('submit', async (e) => {
    // Honeypot: silently drop spam
    if (honeypot && honeypot.value) { e.preventDefault(); return; }

    const endpoint = form.getAttribute('action') || '';
    // If using mailto:, let the browser handle it
    if (endpoint.startsWith('mailto:')) {
      setStatus('Opening mail client…', { polite: true });
      return; // no preventDefault
    }

    // Use fetch for XHR-friendly endpoints (e.g., Formspree)
    e.preventDefault();
    setStatus('Sending…', { polite: true });
    if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }

    try {
      const fd = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Network response was not ok');

      // Optional: check JSON for errors if your backend returns them
      setStatus('Message sent! Thanks ✓', { assertive: true });
      form.reset();
    } catch (err) {
      console.error('[contact] submit failed:', err);
      const fallbackEmail = (form.querySelector('a[href^="mailto:"]')?.getAttribute('href') || '').replace('mailto:', '') || 'hello@example.com';
      setStatus(`Couldn’t send. Please email us: ${fallbackEmail}`, { assertive: true });
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
    }
  });
})();
