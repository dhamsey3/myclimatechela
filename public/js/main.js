/* ========= Footer year (robust) ========= */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* ========= Theme: track system preference ========= */
(() => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const apply = (e) => {
    root.dataset.theme = e.matches ? 'dark' : 'light';
    root.style.colorScheme = e.matches ? 'dark' : 'light';
  };
  apply(mql);
  if (mql.addEventListener) mql.addEventListener('change', apply); else mql.addListener(apply);
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

/* ========= Render posts from posts.json (pager optional & robust) ========= */
(async function () {
  const POSTS_PER_PAGE = 3;
  let page = 0, posts = [], filtered = [];

  const list  = document.getElementById('posts');
  if (!list) return; // only require the list container

  const pager = document.getElementById('pager');
  const older = document.getElementById('older');
  const search = document.getElementById('search');

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  if (search && initialQuery) search.value = initialQuery;

  // Try URLs that work at root and in subfolders; add cache-buster
  const candidates = [
    new URL('./posts.json', window.location.href),
    new URL('posts.json', window.location.href),
    new URL('/posts.json', window.location.origin),
  ];
  candidates.forEach(u => u.searchParams.set('ts', Date.now()));

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
    list.innerHTML = '<p class="muted">No posts yet. Check back soon.</p>';
    if (pager) pager.hidden = true;
    return;
  }

  const dateFmt = new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'numeric' });
  const esc = (s='') => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function card(p) {
    const url = p.url || p.external_url || p.permalink || '#';
    const title = esc(p.title || 'Untitled');
    const imgHTML = p.image
      ? `<a class="hcard-media" href="${esc(url)}" target="_blank" rel="noopener nofollow">
           <img src="${esc(p.image)}" alt="" loading="lazy" decoding="async">
         </a>`
      : `<a class="hcard-media placeholder" href="${esc(url)}" target="_blank" rel="noopener nofollow"><div></div></a>`;

    const dt = p.date ? dateFmt.format(new Date(p.date)) : '';
    const excerpt = esc(p.summary || p.excerpt || '');

    return `
      <article class="hcard">
        ${imgHTML}
        <div class="hcard-body">
          <h3 class="hcard-title"><a href="${esc(url)}" target="_blank" rel="noopener nofollow">${title}</a></h3>
          ${dt ? `<small class="hcard-meta">${dt}</small>` : ''}
          ${excerpt ? `<p class="hcard-text">${excerpt}</p>` : ''}
          ${url && url !== '#' ? `<p><a class="btn" href="${esc(url)}" target="_blank" rel="noopener nofollow">Read on Medium →</a></p>` : ''}
        </div>
      </article>`;
  }

  function renderPage(reset = false) {
    if (reset) { page = 0; list.innerHTML = ''; }
    const start = page * POSTS_PER_PAGE;
    const slice = filtered.slice(start, start + POSTS_PER_PAGE);
    if (!slice.length) {
      if (pager) pager.hidden = true;
      if (reset) list.innerHTML = '<p class="muted">No posts found.</p>';
      return;
    }
    list.insertAdjacentHTML('beforeend', slice.map(card).join(''));
    page++;
    if (pager) pager.hidden = !(page * POSTS_PER_PAGE < filtered.length);
  }

  function applyFilters() {
    const q = search ? search.value.trim().toLowerCase() : '';
    const p = new URLSearchParams(window.location.search);
    const t = p.get('tags');
    const tags = t ? t.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];

    filtered = posts.filter(post => {
      const text = `${post.title || ''} ${(post.summary || post.excerpt || '')}`.toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const postTags = (post.tags || []).map(tag => tag.toLowerCase());
      const matchesTags = !tags.length || tags.every(tag => postTags.includes(tag));
      return matchesQuery && matchesTags;
    });

    renderPage(true);
  }

  if (search) search.addEventListener('input', applyFilters, { passive: true });
  if (older) older.addEventListener('click', () => renderPage(), { passive: true });
  applyFilters();
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

/* ========= Retina safeguards for logos (site-wide) ========= */
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

/* ========= Header: collapsible nav (Home/About/Contact) ========= */
(() => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return; // header on some pages might not be updated yet

  const mql = window.matchMedia('(min-width: 861px)');

  function setOpen(open){
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    btn.classList.toggle('is-open', open);
  }

  // Toggle on click
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Close on link click (mobile)
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Click outside to close (mobile)
  document.addEventListener('click', (e) => {
    if (mql.matches) return; // desktop
    if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  // Keep state in sync on resize
  function sync(){
    if (mql.matches){
      btn.setAttribute('aria-expanded','false');
      nav.removeAttribute('aria-hidden'); // always visible on desktop
      btn.classList.remove('is-open');
    } else {
      nav.setAttribute('aria-hidden','true'); // closed by default on mobile
    }
  }
  (mql.addEventListener ? mql.addEventListener('change', sync) : window.addEventListener('resize', sync));
  sync();

  // Optional: auto-mark active link if not set server-side
  try {
    const path = location.pathname.replace(/\/index\.html?$/,'/') || '/';
    const links = nav.querySelectorAll('a[href]');
    let hasActive = false;
    links.forEach(a => { if (a.classList.contains('active')) hasActive = true; });
    if (!hasActive){
      links.forEach(a => {
        const href = a.getAttribute('href');
        if (href === path) a.classList.add('active');
      });
    }
  } catch(_) {}
})();

/* ========= Contact form (FormSubmit or mailto) ========= */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('[type="submit"]');
  const honeypot = form.querySelector('#_honey'); // hidden anti-spam

  const setStatus = (text, kind = 'polite') => {
    if (!status) return;
    status.textContent = text || '';
    status.setAttribute('aria-live', kind === 'assertive' ? 'assertive' : 'polite');
  };

  form.addEventListener('submit', async (e) => {
    // Block obvious bots
    if (honeypot && honeypot.value) { e.preventDefault(); return; }

    const endpoint = form.getAttribute('action') || '';
    if (!endpoint) return;

    // If it's mailto:, let the browser handle it
    if (endpoint.startsWith('mailto:')) {
      setStatus('Opening your mail app…', 'polite');
      return; // do not preventDefault
    }

    // Otherwise POST via fetch (FormSubmit, Formspree, etc.)
    e.preventDefault();
    setStatus('Sending…', 'polite');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy', 'true'); }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Bad response');
      setStatus('Message sent! Thanks ✓', 'assertive');
      form.reset();
    } catch (err) {
      console.error('[contact] submit failed:', err);
      setStatus('Couldn’t send. Please try again, or use the email link in the footer.', 'assertive');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.removeAttribute('aria-busy'); }
    }
  });
})();
