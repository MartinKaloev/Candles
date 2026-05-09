/* ── Theme ── */
const THEME_KEY = 'ilona-theme';

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = t === 'bordeaux' ? '◆ B & W' : '◆ BORDEAUX';
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'bordeaux';
  applyTheme(cur === 'bordeaux' ? 'bw' : 'bordeaux');
}

/* ── Active nav link ── */
function markActive() {
  const file = window.location.pathname.split('/').pop() || 'home.html';
  const page = file.replace('.html', '');
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });
}

/* ── Mobile nav ── */
function initNav() {
  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!ham || !links) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
}

/* ── Gallery ── */
function initGallery() {
  const wrapper = document.querySelector('.gallery-wrapper');
  const track = document.querySelector('.gallery-track');
  if (!wrapper || !track) return;

  const slides = track.querySelectorAll('.gallery-slide');
  let current = 0, isDragging = false, startX = 0, delta = 0;

  function perView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  function maxIdx() { return Math.max(0, slides.length - perView()); }
  function slideWidth() { return slides[0] ? slides[0].offsetWidth + 16 : 0; }

  function goTo(i) {
    current = Math.max(0, Math.min(i, maxIdx()));
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    document.querySelectorAll('.gallery-dot').forEach((d, j) =>
      d.classList.toggle('active', j === current));
  }

  function buildDots() {
    const c = document.querySelector('.gallery-dots');
    if (!c) return;
    c.innerHTML = '';
    for (let i = 0; i <= maxIdx(); i++) {
      const d = document.createElement('button');
      d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      c.appendChild(d);
    }
  }

  document.querySelector('.gallery-prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.gallery-next')?.addEventListener('click', () => goTo(current + 1));

  wrapper.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; delta = 0; wrapper.classList.add('grabbing'); });
  window.addEventListener('mousemove', e => { if (isDragging) delta = e.clientX - startX; });
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false; wrapper.classList.remove('grabbing');
    if (delta < -50) goTo(current + 1);
    else if (delta > 50) goTo(current - 1);
    else goTo(current);
  });
  wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; delta = 0; }, { passive: true });
  wrapper.addEventListener('touchmove', e => { delta = e.touches[0].clientX - startX; }, { passive: true });
  wrapper.addEventListener('touchend', () => {
    if (delta < -50) goTo(current + 1);
    else if (delta > 50) goTo(current - 1);
    else goTo(current);
  });

  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIdx())); });
  buildDots();
  goTo(0);
}

/* ── Copy email ── */
function initCopyEmail() {
  const btn = document.querySelector('.copy-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.email).then(() => {
      btn.textContent = 'COPIED!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 2000);
    });
  });
}

/* ── INI parser ── */
function parseINI(text) {
  const out = {};
  let section = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;
    const sm = line.match(/^\[(.+)\]$/);
    if (sm) { section = sm[1].trim(); out[section] = {}; continue; }
    const eq = line.indexOf('=');
    if (eq > 0 && section) {
      out[section][line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  }
  return out;
}

/* ── Social icon SVGs ── */
const ICONS = {
  facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
  youtube:  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  etsy:     `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.049 2.109C9.818.81 9.474.158 7.294.01L6.618 0V0l.213.006C8.213-.01 11.407-.07 12-.07s3.787.06 5.169 0L17.382 0V0l-.676.01c-2.186.148-2.524.8-2.755 2.099L14 2.87 13.93 21l.07.87c.231 1.3.569 1.951 2.755 2.099l.676.031V24l-.213-.006C15.787 24.07 12.593 24.07 12 24.07s-3.787 0-5.169.006L6.618 24v-.875l.676-.031c2.18-.148 2.476-.799 2.755-2.099L10 21V3l-.06-.369-.131-.522zM5.76 11l-.4-2H4V7h8.5l.5 2.5L10.5 10S9.6 9 8 9H7.5v3H10l-.5 2H7.5v3H9c1.6 0 2-1 2-1l2.5.5L13 19H4v-2h1.5l.26-1V11z"/></svg>`,
  email:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.148C21.69 2.28 24 3.434 24 5.457z"/></svg>`
};

/* ── Candle placeholder for product cards ── */
const CANDLE_PH = `<svg class="candle-icon" viewBox="0 0 28 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g class="candle-flame"><ellipse cx="14" cy="6" rx="5" ry="7" class="candle-flame-outer"/><ellipse cx="14" cy="8" rx="3" ry="4.5" class="candle-flame-mid"/><ellipse cx="14" cy="10" rx="1.8" ry="2.8" class="candle-flame-inner"/></g><line x1="14" y1="14" x2="14" y2="17" class="candle-wick" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="14" cy="17.5" rx="7" ry="2.5" class="candle-wax-top"/><rect x="7" y="17" width="14" height="26" rx="2" class="candle-body-rect"/></svg>`;

/* ── Render products from config ── */
function applyProducts(cfg) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const etsyUrl = cfg.social?.etsy || 'https://www.etsy.com';
  const products = Object.keys(cfg)
    .filter(k => /^product\d+$/i.test(k))
    .sort((a, b) => parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, '')))
    .map(k => cfg[k])
    .filter(p => p.name);

  if (!products.length) return;

  grid.innerHTML = products.map(p => {
    const pic = p.pic ? p.pic.trim() : '';
    const imgHtml = pic
      ? `<img class="product-card-img" src="candle%20galery/${encodeURIComponent(pic)}" alt="${p.name}" loading="lazy">`
      : `<div class="product-card-img ph">${CANDLE_PH}</div>`;
    return `<div class="product-card">
      ${imgHtml}
      <div class="product-card-body">
        <h3>${p.name}</h3>
        <p>${p.desc || ''}</p>
        <a href="${etsyUrl}" target="_blank" rel="noopener" class="btn">VIEW ON ETSY</a>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('img.product-card-img').forEach(img => {
    img.addEventListener('error', () => {
      const div = document.createElement('div');
      div.className = 'product-card-img ph';
      div.innerHTML = CANDLE_PH;
      img.replaceWith(div);
    }, { once: true });
  });

  const bannerLink = document.getElementById('etsy-link');
  if (bannerLink) bannerLink.href = etsyUrl;
}

/* ── Render socials from config ── */
function applySocials(social) {
  const container = document.getElementById('social-container');
  const emailBox = document.getElementById('email-box');
  if (!social) return;

  const items = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'youtube',  label: 'YouTube'  },
    { key: 'etsy',     label: 'Etsy Shop'},
    { key: 'email',    label: 'Email Us' },
  ];

  if (container) {
    container.innerHTML = items
      .filter(item => social[item.key])
      .map(item => {
        const href = item.key === 'email' ? `mailto:${social[item.key]}` : social[item.key];
        const ext  = item.key !== 'email' ? 'target="_blank" rel="noopener"' : '';
        return `<a href="${href}" ${ext} class="social-btn">${ICONS[item.key] || ''}<span>${item.label}</span></a>`;
      }).join('');
  }

  if (emailBox && social.email) {
    const txt = emailBox.querySelector('.email-text');
    const btn = emailBox.querySelector('.copy-btn');
    if (txt) txt.textContent = social.email;
    if (btn) { btn.dataset.email = social.email; }
  }
}

/* ── Load wax.ini ── */
async function initConfig() {
  const hasProducts = !!document.getElementById('products-grid');
  const hasSocials  = !!document.getElementById('social-container');
  if (!hasProducts && !hasSocials) return;

  try {
    const res = await fetch('wax.ini', { cache: 'no-cache' });
    if (!res.ok) throw new Error('not found');
    const cfg = parseINI(await res.text());
    applyProducts(cfg);
    applySocials(cfg.social);
    initCopyEmail();
  } catch {
    const msg = `<p style="color:var(--muted);text-align:center;padding:2rem;grid-column:1/-1">
      Open the site through a local server to load from <strong>wax.ini</strong>.<br>
      <small>Run in terminal: <code>python3 -m http.server 8000</code><br>
      Then open <strong>http://localhost:8000/home.html</strong></small></p>`;
    const grid = document.getElementById('products-grid');
    const sc   = document.getElementById('social-container');
    if (grid) grid.innerHTML = msg;
    if (sc)   sc.innerHTML = msg;
  }
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem(THEME_KEY) || 'bordeaux';
  applyTheme(saved);
  markActive();
  initNav();
  initGallery();
  initConfig();
  if (!document.getElementById('products-grid') && !document.getElementById('social-container')) {
    initCopyEmail();
  }
  document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
});
