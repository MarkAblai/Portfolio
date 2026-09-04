/* Smooth scrolling — Lenis by darkroom.engineering (vendored in js/vendor/lenis.min.js).
   Loaded on every page, before js/main.js. Replaces the browser's stepped wheel
   scroll with an interpolated one, so the scroll scenes glide instead of snapping.

   Exposes window.smoothScroll (the Lenis instance) — js/main.js drives the scene
   transforms off its 'scroll' event so they stay in sync with the eased position.
   Tune the feel in OPTIONS below; nothing else in the site needs to change. */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reduced-motion users get the plain native scroll, and if this script or the
     Lenis bundle fails to load the page still scrolls — nothing here is required. */
  if (reduced || typeof window.Lenis !== 'function') return;

  const lenis = new window.Lenis({
    lerp: 0.09,                 /* how hard the scroll chases the wheel: lower = longer glide */
    wheelMultiplier: 1,         /* wheel distance per notch */
    touchMultiplier: 1.6,
    smoothWheel: true,
    syncTouch: false,           /* phones keep their own native momentum */
    allowNestedScroll: true,    /* the ship's-log panel scrolls itself, then hands the page back */
    stopInertiaOnNavigate: true,/* kill leftover momentum when leaving for another page */
    autoRaf: false              /* we own the frame loop below */
  });

  window.smoothScroll = lenis;

  requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  });

  /* Same-page anchors (nav, hero buttons). The browser's jump is instant now that
     .lenis turns off CSS scroll-behavior, so hand the trip to Lenis instead. */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    let target;
    try { target = document.querySelector(hash); } catch (err) { return; }
    if (!target) return;

    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.4 });
    history.pushState(null, '', hash);
  });
})();
