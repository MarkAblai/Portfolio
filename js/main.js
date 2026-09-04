/* Mark Ablai portfolio — scroll scenes + JSON content
   Edit data/content.json and data/feed.json — not this file. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- content ---------- */
const FALLBACK = {
  name: 'MARK ABLAI',
  tagline: 'CYBERSECURITY · NETWORKING · LINUX',
  subline: 'CCDC Linux Team Lead — 1st in Missouri · CompTIA Network+ · Proxmox homelab',
  projectsSub: 'Charted territory — full writeups, configs, and diagrams.',
  feedSub: 'Riding the koi — latest findings from the voyage.',
  email: 'you@example.com',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
  projects: [
    { title: 'PROXMOX HOMELAB', badge: 'FEATURED',
      desc: 'VLANs, firewall, VPN, centralized logging, backups. Full network map and config walkthrough.',
      link: 'homelab.html', linkText: 'Read the chart' },
    { title: 'FORTIGATE APP CONTROL',
      desc: 'Application control policy design and enforcement — coursework project writeup.',
      link: '#', linkText: 'Read the chart' },
    { title: 'CCDC LINUX TOOLKIT',
      desc: 'Hardening scripts, checklists, and incident-response prep that took the Linux team to 1st in Missouri.',
      link: '#', linkText: 'Read the chart' },
    { title: 'MORE UNDERWAY',
      desc: 'Wazuh SIEM build and CCNA lab notes — coming to the log.' }
  ]
};

async function loadJSON(path, fallback) {
  try {
    const r = await fetch(path);
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) { return fallback; }
}

function fillContent(c) {
  document.querySelectorAll('[data-c]').forEach(el => {
    const key = el.getAttribute('data-c');
    if (c[key]) el.textContent = c[key];
  });
  const email = document.getElementById('email-link');
  if (email && c.email) email.href = 'mailto:' + c.email;
  const li = document.getElementById('link-linkedin');
  if (li && c.linkedin) li.href = c.linkedin;
  const gh = document.getElementById('link-github');
  if (gh && c.github) gh.href = c.github;

  const cards = document.getElementById('cards');
  if (cards && Array.isArray(c.projects)) {
    cards.innerHTML = '';
    c.projects.forEach((p, i) => {
      const el = document.createElement('article');
      el.className = 'card reveal';
      el.style.setProperty('--d', (i * 0.12) + 's');
      el.innerHTML =
        (p.badge ? `<span class="card-badge">${p.badge}</span>` : '') +
        `<h3>${p.title}</h3><p>${p.desc || ''}</p>` +
        (p.link ? `<a class="card-link" href="${p.link}">${p.linkText || 'Read more'} →</a>` : '');
      cards.appendChild(el);
    });
    observeReveals();
  }
}

function fillFeed(items) {
  const list = document.getElementById('feed-list');
  if (!list || !Array.isArray(items)) return;
  list.innerHTML = '';
  items.forEach(it => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="feed-date">${it.date}</span><span class="feed-text">${it.text}</span>`;
    list.appendChild(li);
  });
}

/* ---------- reveals ---------- */
let io;
function observeReveals() {
  if (reduced) { document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); return; }
  io = io || new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---------- scroll scenes ---------- */
const heroStage = document.querySelector('.hero-stage');
const sea       = document.querySelector('.hero-sea');
const star      = document.querySelector('.hero-star');
const copy      = document.querySelector('.hero-copy');
const cloudL    = document.querySelector('.clouds-left');
const cloudR    = document.querySelector('.clouds-right');
const cloudML   = document.querySelector('.clouds-mid-l');
const cloudMR   = document.querySelector('.clouds-mid-r');
const hint      = document.querySelector('.scroll-hint');
const routes    = document.querySelector('.route-lines');

const zoomStage = document.querySelector('.zoom-stage');
const scalesBg  = document.querySelector('.scales-bg');
const feedPanel = document.querySelector('.feed-panel');

const koi       = document.querySelector('.koi');
const projects  = document.querySelector('.projects');

function stageProgress(stage) {
  const rect = stage.getBoundingClientRect();
  const total = stage.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return clamp(-rect.top / total, 0, 1);
}

function tick() {
  /* Scene 1 — dive through the clouds over the chart */
  if (heroStage && sea) {
    const p = stageProgress(heroStage);
    sea.style.transform    = `rotateX(${p * 26}deg) translateY(${p * 14}vh) scale(${1 + p * 0.55})`;
    star.style.transform   = `translate(-50%,-50%) translateY(${p * 20}vh) scale(${1 + p * 0.4})`;
    star.style.opacity     = String(1 - p * 0.9);
    copy.style.transform   = `translateX(-50%) translateY(${p * -26}vh)`;
    copy.style.opacity     = String(1 - p * 1.7);
    cloudL.style.transform = `translate(${p * -30}vw, ${p * 34}vh) scale(${1 + p * 1.5})`;
    cloudR.style.transform = `translate(${p * 30}vw, ${p * 34}vh) scale(${1 + p * 1.5})`;
    if (cloudML) cloudML.style.transform = `translate(${p * -16}vw, ${p * 20}vh) scale(${1 + p * 0.9})`;
    if (cloudMR) cloudMR.style.transform = `translate(${p * 16}vw, ${p * 20}vh) scale(${1 + p * 0.9})`;
    if (hint) hint.style.opacity = String(1 - p * 4);
    if (routes) routes.style.strokeDashoffset = String(60 - p * 60);
  }

  /* Scene 2 — koi drifts down as you scroll past */
  if (koi && projects) {
    const r = projects.getBoundingClientRect();
    const p = clamp(1 - r.bottom / (window.innerHeight + r.height), 0, 1);
    koi.style.transform = `translateY(${p * 42}vh) rotate(${p * 10 - 4}deg)`;
  }

  /* Scene 3 — zoom onto the koi's back */
  if (zoomStage && scalesBg) {
    const p = stageProgress(zoomStage);
    const s = 0.32 + Math.min(p * 1.7, 1) * 0.68;
    scalesBg.style.transform = `scale(${s})`;
    scalesBg.style.opacity   = String(Math.min(p * 3, 1));
    const q = clamp((p - 0.42) * 2.4, 0, 1);
    feedPanel.style.opacity   = String(q);
    feedPanel.style.transform = `translateY(${(1 - q) * 46}px)`;
  }
}

let raf = null;
function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => { tick(); raf = null; });
}

/* ---------- init ---------- */
(async function init() {
  const content = await loadJSON('data/content.json', FALLBACK);
  fillContent(Object.assign({}, FALLBACK, content));
  const feed = await loadJSON('data/feed.json', [
    { date: 'FEB 2026', text: 'CCDC state qualifier — 1st in Missouri as Linux team lead. 42 incidents handled, 90%+ service uptime.' },
    { date: 'EDIT ME', text: 'Add entries in data/feed.json — newest first.' }
  ]);
  fillFeed(feed);
  observeReveals();
  if (!reduced) {
    /* Lenis (js/smooth-scroll.js) eases the scroll position, so when it's running
       drive the scenes off its frame-synced event — the native scroll event reports
       the raw position and would leave the transforms a step behind the page. */
    if (window.smoothScroll) window.smoothScroll.on('scroll', tick);
    else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    tick();
  }
})();
