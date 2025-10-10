/* ========= Footer year (robust) ========= */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* ========= Service Worker registration ========= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('[sw] registration failed:', err);
    });
  });
}

/* ========= Theme preference (system/light/dark with persistence) ========= */
(() => {
  const root = document.documentElement;
  const storageKey = 'theme-preference';
  const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredMode() {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }

  function effectiveTheme(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    return systemQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(mode) {
    const theme = effectiveTheme(mode);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.dataset.mode = mode;
      const label = `Theme: ${mode[0].toUpperCase()}${mode.slice(1)}`;
      btn.setAttribute('aria-label', label);
      btn.title = label;
    });
  }

  function setMode(mode) {
    localStorage.setItem(storageKey, mode);
    applyTheme(mode);
  }

  // Sync on system change if in system mode
  const onSystemChange = () => { if (getStoredMode() === 'system') applyTheme('system'); };
  systemQuery.addEventListener ? systemQuery.addEventListener('change', onSystemChange) : systemQuery.addListener(onSystemChange);

  // Initialize
  applyTheme(getStoredMode());

  // Wire up buttons (supports multiple pages)
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const order = ['system', 'light', 'dark'];
        const current = getStoredMode();
        const next = order[(order.indexOf(current) + 1) % order.length];
        setMode(next);
      }, { passive: true });
    });
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

  // Pointer swipe/drag support
  const viewport = slider.querySelector('.slider-viewport');
  if (viewport) {
    let isDragging = false;
    let dragStartX = 0;
    let dragDeltaX = 0;

    function thresholdPx() { return viewport.clientWidth * 0.15; }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return; // left/mouse only
      isDragging = true;
      dragStartX = e.clientX;
      dragDeltaX = 0;
      viewport.setPointerCapture && viewport.setPointerCapture(e.pointerId);
      slider.dataset.dragging = 'true';
      track.style.transition = 'none';
      stop();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      dragDeltaX = e.clientX - dragStartX;
      // Prevent image drag/scroll while swiping
      if (Math.abs(dragDeltaX) > 2) e.preventDefault();
      track.style.transform = `translateX(calc(${-i * 100}% + ${dragDeltaX}px))`;
    }

    function endDrag() {
      if (!isDragging) return;
      const dx = dragDeltaX;
      isDragging = false;
      slider.dataset.dragging = 'false';
      track.style.transition = '';
      if (Math.abs(dx) > thresholdPx()) {
        go(i + (dx < 0 ? 1 : -1));
      } else {
        go(i);
      }
      start();
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', () => { if (isDragging) endDrag(); });
  }

  go(0); start();
})();

/* ========= Render posts from posts.json (pager optional & robust) ========= */
(async function () {
  const POSTS_PER_PAGE = 3;
  let page = 0, posts = [], filtered = [], isLoading = true;

  const list  = document.getElementById('posts');
  if (!list) return; // only require the list container

  // Share button handler (Web Share API with fallback)
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;
    const url = btn.dataset.url;
    const title = btn.dataset.title || document.title;
    if (navigator.share) {
      navigator.share({ title, url }).catch(err => console.warn('[share] failed:', err));
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'noopener');
    }
  });

  const pager = document.getElementById('pager');
  const older = document.getElementById('older');
  const search = document.getElementById('search');
  const clearBtn = document.getElementById('clearSearch');
  const resultCount = document.getElementById('resultCount');

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

  // Skeleton loading placeholders while fetching
  function renderSkeletonCards(count = 3) {
    const s = [];
    for (let k = 0; k < count; k++) {
      s.push(`
        <article class="hcard skeleton">
          <a class="hcard-media placeholder"><div></div></a>
          <div class="hcard-body">
            <div class="skeleton-line" style="width:60%; height:18px; margin:4px 0 10px"></div>
            <div class="skeleton-line" style="width:30%; height:12px; margin:6px 0 14px"></div>
            <div class="skeleton-line" style="width:95%; margin:6px 0"></div>
            <div class="skeleton-line" style="width:88%; margin:6px 0"></div>
            <div class="skeleton-line" style="width:72%; margin:6px 0"></div>
          </div>
        </article>`);
    }
    list.innerHTML = s.join('');
    if (pager) pager.hidden = true;
  }

  renderSkeletonCards(3);

  posts = (await fetchFirstOk(candidates)) || [];
  isLoading = false;

  const dateFmt = new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'numeric' });
  const esc = (s='') => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function card(p) {
    const url = p.url || p.external_url || p.permalink || '#';
    const rawTitle = p.title || 'Untitled';
    const title = esc(rawTitle);
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
          ${url && url !== '#' ? `
            <div class="hcard-share">
              <button type="button" class="icon share-btn" data-url="${esc(url)}" data-title="${esc(rawTitle)}" aria-label="Share this post">
                <svg viewBox="0 0 24 24"><path d="M4 12v8h16v-8" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M16 6l-4-4-4 4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M12 2v13" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
              </button>
              <a class="icon twitter" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(rawTitle)}" target="_blank" rel="noopener" aria-label="Share on Twitter">
                <svg viewBox="0 0 24 24"><path d="M4 3h4.8l4.6 6.6L18.7 3H21l-6.8 9.5L21.3 21h-4.8l-5-7L9 21H6.7l6.8-9.5L4 3z"/></svg>
              </a>
              <a class="icon linkedin" href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(rawTitle)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M6.94 8.5H3.56V21h3.38V8.5zM5.25 3a2.02 2.02 0 100 4.04 2.02 2.02 0 000-4.04zM20.44 21h-3.37v-6.5c0-1.55-.03-3.53-2.15-3.53-2.15 0-2.48 1.67-2.48 3.41V21h-3.37V8.5h3.23v1.71h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.17V21z"/></svg>
              </a>
            </div>` : ''}
        </div>
      </article>`;
  }

  // Reveal-on-scroll
  let cardObserver;
  function getObserver() {
    if (cardObserver) return cardObserver;
    cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.dataset.revealed = '1';
          cardObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    return cardObserver;
  }

  function observeNewCards() {
    const obs = getObserver();
    list.querySelectorAll('.hcard:not([data-revealed])').forEach(card => {
      card.classList.add('will-reveal');
      obs.observe(card);
    });
  }

  function renderPage(reset = false) {
    if (reset) { page = 0; list.innerHTML = ''; }
    const start = page * POSTS_PER_PAGE;
    const slice = filtered.slice(start, start + POSTS_PER_PAGE);
    if (!slice.length) {
      if (pager) pager.hidden = true;
      if (reset) list.innerHTML = `<p class="muted">${posts.length ? 'No posts found.' : 'No posts yet. Check back soon.'}</p>`;
      return;
    }
    list.insertAdjacentHTML('beforeend', slice.map(card).join(''));
    page++;
    if (pager) pager.hidden = !(page * POSTS_PER_PAGE < filtered.length);
    observeNewCards();
  }

  function applyFilters() {
    if (isLoading) return; // keep skeletons until data arrives
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
    // Result count and clear visibility
    if (resultCount) {
      const count = filtered.length;
      resultCount.textContent = q || tags.length ? (count ? `${count} result${count !== 1 ? 's' : ''}` : 'No results') : '';
    }
    if (clearBtn) { clearBtn.hidden = !q; }

    renderPage(true);
  }

  if (search) search.addEventListener('input', applyFilters, { passive: true });
  if (clearBtn && search) clearBtn.addEventListener('click', () => { search.value = ''; applyFilters(); }, { passive: true });
  if (older) older.addEventListener('click', () => renderPage(), { passive: true });
  // Keyboard shortcut: '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (document.activeElement && (/input|textarea|select/i).test(document.activeElement.tagName)) return;
      if (search) { e.preventDefault(); search.focus(); }
    }
  });

  // Now that posts are loaded, apply filters to render first page
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
