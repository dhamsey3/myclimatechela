/* UI enhancements for mc-theme-v2
   - Enhanced staggered reveal for lists
   - Builds a simple TOC for articles (if present) with accessible focus
   - Prepares floating share container (desktop)
   - Adds a reduced-motion toggle persisted in localStorage
*/

(function(){
  const prefersReducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const userReducedAttr = document.documentElement.hasAttribute('data-reduced-motion');
  const prefersReduced = prefersReducedMQ.matches || userReducedAttr;

  // Staggered reveal: observes elements with .reveal-stagger and applies .revealed
  function setupStaggerReveal(){
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    if (prefersReduced) {
      document.querySelectorAll('.reveal-stagger').forEach(el => el.classList.add('revealed'));
      return;
    }
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-stagger').forEach(el => el.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = Number(el.dataset.revealIndex || 0);
        const delay = (isTouch ? idx * 60 : idx * 90);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('revealed');
        obs.unobserve(el);
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    const observeAll = () => {
      document.querySelectorAll('.reveal-stagger').forEach((el, i) => {
        if (!el.classList.contains('revealed')){
          el.dataset.revealIndex = i % 12;
          io.observe(el);
        }
      });
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // Floating share container for desktop
  function initFloatingShare(){
    // Remove existing if any
    const existing = document.querySelector('.mc-share-float');
    if (existing) existing.remove();
    if (window.innerWidth < 900) return;

    const container = document.createElement('div');
    container.className = 'mc-share-float';

    function makeShareButtons(){
      container.innerHTML = '';
      const pageUrl = window.location.href;
      const pageTitle = document.title || '';

      // main share button
      const mainBtn = document.createElement('button');
      mainBtn.className = 'share-btn';
      mainBtn.type = 'button';
      mainBtn.setAttribute('aria-label','Share');
      mainBtn.title = 'Share';
      mainBtn.textContent = '🔗';
      mainBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try { await navigator.share({ title: pageTitle, url: pageUrl }); return; } catch(e){}
        }
        try {
          await navigator.clipboard.writeText(pageUrl);
          mainBtn.title = 'Link copied';
          showShareToast('Link copied to clipboard');
          setTimeout(() => mainBtn.title = 'Share', 1400);
        } catch {
          window.open(pageUrl, '_blank', 'noopener');
        }
      });

      const tw = document.createElement('a');
      tw.className = 'share-btn'; tw.setAttribute('aria-label','Share on X'); tw.title = 'Share on X';
      tw.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
      tw.target = '_blank'; tw.rel = 'noopener'; tw.textContent = 'X';

      const ln = document.createElement('a');
      ln.className = 'share-btn'; ln.setAttribute('aria-label','Share on LinkedIn'); ln.title = 'Share on LinkedIn';
      ln.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      ln.target = '_blank'; ln.rel = 'noopener'; ln.textContent = 'in';

      container.appendChild(mainBtn);
      container.appendChild(tw);
      container.appendChild(ln);
    }

    makeShareButtons();
    try { document.body.appendChild(container); } catch(e) { /* ignore */ }

    // Recreate on resize so it appears/disappears at the correct breakpoints
    let resizeTimer;
    function onResize(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth < 900){ const ex = document.querySelector('.mc-share-float'); if (ex) ex.remove(); }
        else { if (!document.querySelector('.mc-share-float')) initFloatingShare(); }
      }, 200);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
  }

  // Small toast for copy/share confirmations (re-usable)
  function showShareToast(message){
    try {
      let toast = document.querySelector('.mc-toast');
      if (!toast){
        toast = document.createElement('div');
        toast.className = 'mc-toast';
        toast.setAttribute('role','status');
        toast.setAttribute('aria-live','polite');
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      // ensure it's visible
      toast.classList.add('show');
      if (toast._hideTimer) clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => { toast.classList.remove('show'); }, 1700);
    } catch(e){ /* non-fatal */ }
  }

  // Build a simple TOC for articles (h2/h3) and add accessible smooth focus behavior
  function buildTOC(){
    const article = document.querySelector('article');
    if (!article) return;
    const headings = article.querySelectorAll('h2, h3');
    if (!headings.length) return;
    if (document.querySelector('.mc-toc')) return;

    const nav = document.createElement('nav');
    nav.className = 'mc-toc';
    nav.setAttribute('aria-label', 'Table of contents');
    const ol = document.createElement('ol');
    headings.forEach(h => {
      if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.appendChild(a);
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    try { document.body.appendChild(nav); } catch(e) {}

    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      e.preventDefault();
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      setTimeout(() => target.removeAttribute('tabindex'), 1200);
    });
  }

  // Reduced-motion toggle persisted to localStorage
  function initReducedMotionToggle(){
    const key = 'mc:reducedMotion';
    const header = document.querySelector('.site-header');
    if (!header) return;
    const btn = document.createElement('button');
    btn.className = 'mc-rm-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Toggle reduced motion');
    btn.title = 'Toggle reduced motion';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2v4M12 18v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M2 12h4M18 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';

    btn.addEventListener('click', () => {
      const cur = localStorage.getItem(key) === '1';
      if (cur){
        localStorage.removeItem(key);
        document.documentElement.removeAttribute('data-reduced-motion');
        btn.setAttribute('aria-pressed','false');
      } else {
        localStorage.setItem(key,'1');
        document.documentElement.setAttribute('data-reduced-motion','1');
        btn.setAttribute('aria-pressed','true');
      }
    });

    if (localStorage.getItem(key) === '1'){
      document.documentElement.setAttribute('data-reduced-motion','1');
      btn.setAttribute('aria-pressed','true');
    }

    const inner = header.querySelector('.header-inner') || header;
    inner.appendChild(btn);
  }

  function initAll(){ setupStaggerReveal(); initFloatingShare(); buildTOC(); initReducedMotionToggle(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();

  if (prefersReducedMQ && prefersReducedMQ.addEventListener) {
    prefersReducedMQ.addEventListener('change', (e) => {
      if (!localStorage.getItem('mc:reducedMotion')) {
        if (e.matches) document.documentElement.setAttribute('data-reduced-motion','1');
        else document.documentElement.removeAttribute('data-reduced-motion');
      }
    });
  }

  // Back-to-top floating button
  function initBackToTop(){
    if (document.querySelector('.mc-backtop')) return;
    const btn = document.createElement('button');
    btn.className = 'mc-backtop';
    btn.setAttribute('aria-label','Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-7 7h4v7h6v-7h4z" fill="currentColor"/></svg>';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const behavior = (document.documentElement.hasAttribute('data-reduced-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
      // Move focus to top landmark for screen readers
      const first = document.querySelector('header') || document.body;
      if (first){
        first.setAttribute('tabindex','-1');
        first.focus({preventScroll:true});
        setTimeout(() => first.removeAttribute('tabindex'), 1200);
      }
    });
    document.body.appendChild(btn);

    let shown = false;
    const threshold = 300;
    function check(){
      if (window.scrollY > threshold){
        if (!shown){ btn.classList.add('visible'); shown = true; }
      } else {
        if (shown){ btn.classList.remove('visible'); shown = false; }
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    // initial check
    check();
  }

  // ensure back-to-top is initialized after DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBackToTop); else initBackToTop();

})();
