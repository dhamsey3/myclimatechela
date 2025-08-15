// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* ========= Slider (automatic, one at a time) ========= */
(function () {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track   = slider.querySelector('.slider-track');
  const slides  = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap= slider.querySelector('.slider-dots');
  const prev    = slider.querySelector('.slider-btn.prev');
  const next    = slider.querySelector('.slider-btn.next');

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

  function start(){
    stop();
    if (!prefersReduced) timer = setInterval(() => go(i + 1), 5000);
  }
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

/* ========= Render Medium posts from posts.json ========= */
(async function () {
  const POSTS_PER_PAGE = 3;
  let page = 0, posts = [];

  const list  = document.getElementById('posts');
  const pager = document.getElementById('pager');
  const older = document.getElementById('older');

  if (!list || !pager || !older) return;

  try {
    // 👉 RELATIVE path so it works on custom domains & GH Pages
    const res = await fetch('posts.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    posts = await res.json();
    if (!Array.isArray(posts)) throw new Error('posts.json is not an array');
  } catch (e) {
    console.error('Failed to load posts.json', e);
    list.innerHTML = '<p style="color:#666">No posts yet. Check back soon.</p>';
    pager.hidden = true;
    return;
  }

  const dateFmt = new Intl.DateTimeFormat(undefined, { year:'numeric', month:'short', day:'numeric' });

  function esc(s){ return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function card(p) {
    const url = p.external_url || p.permalink || '#';
    const img = p.image
      ? `<a class="hcard-media" href="${url}" target="_blank" rel="noopener nofollow">
           <img src="${p.image}" alt="${esc(p.title || 'Post image')}" loading="lazy">
         </a>`
      : `<a class="hcard-media placeholder" href="${url}" target="_blank" rel="noopener nofollow"><div></div></a>`;
    return `
      <article class="hcard">
        ${img}
        <div class="hcard-body">
          <h3 class="hcard-title"><a href="${url}" target="_blank" rel="noopener nofollow">${esc(p.title)}</a></h3>
          <small class="hcard-meta">${p.date ? dateFmt.format(new Date(p.date)) : ''}</small>
          <p class="hcard-text">${esc(p.summary || '')}</p>
          ${url && url !== '#' ? `<p><a class="btn" href="${url}" target="_blank" rel="noopener nofollow">Read on Medium →</a></p>` : ''}
        </div>
      </article>`;
  }

  function renderPage() {
    const start = page * POSTS_PER_PAGE;
    const slice = posts.slice(start, start + POSTS_PER_PAGE);
    if (slice.length === 0) {
      pager.hidden = true;
      return;
    }
    list.insertAdjacentHTML('beforeend', slice.map(card).join(''));
    page++;
    pager.hidden = !(page * POSTS_PER_PAGE < posts.length);
  }

  older.addEventListener('click', renderPage, { passive: true });
  renderPage();
})();

/* ========= Enhance UX: Smooth back-to-top ========= */
(() => {
  const link = document.querySelector('.backtop');
  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
