/* Homelab page intro — linked only from homelab.html, in <head>, so the "hold until
   animated" class lands before first paint (no flash of content that then vanishes).

   Runs once when the page opens (not on scroll):
     1. <h1 class="hl-title"> types itself out behind a blinking caret; the caret
        fades about a second after the last character.
     2. Then .lede + each <section class="hl-slide"> slides in from the left,
        staggered top to bottom.

   Every hide rule in css/homelab.css is scoped under html.hl-anim, and only this
   script adds that class — no JS / failed load = the plain static page. Reduced-motion
   users never get the class. Timing knobs are the constants below. */

(function () {
  const TYPE_MS = 60;           /* per character */
  const TYPE_START_MS = 300;    /* caret blinks alone this long before the first letter */
  const CARET_LINGER_MS = 1000; /* caret stays after the last letter, then fades (.4s in CSS) */
  const STAGGER_MS = 100;       /* gap between each body block starting */
  const FONT_WAIT_MS = 800;     /* max wait for Anton, so letters don't swap face mid-type */
  const FAILSAFE_MS = 6000;     /* if anything stalls, just show the page */

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  root.classList.add('hl-anim');

  let finished = false;
  function showAll() { if (!finished) { finished = true; root.classList.remove('hl-anim'); } }
  setTimeout(showAll, FAILSAFE_MS);

  document.addEventListener('DOMContentLoaded', () => {
    try { run(); } catch (err) { showAll(); }
  });

  function run() {
    const title = document.querySelector('.hl-title');
    const blocks = document.querySelectorAll('.hl-slide');

    blocks.forEach((el, i) => el.style.setProperty('--hl-delay', (i * STAGGER_MS) + 'ms'));

    function slideIn() {
      blocks.forEach((el) => el.classList.add('is-in'));
      finished = true;          /* from here on everything is (becoming) visible */
    }

    if (!title) { slideIn(); return; }

    /* Screen readers + search get the real text (still in the HTML source, and kept
       here in a visually-hidden span); the per-letter copy is decoration only. All
       letters are laid out from the start at opacity 0, so the heading's size is
       reserved before typing and nothing shifts. */
    const text = title.textContent.trim();
    const label = document.createElement('span');
    label.className = 'hl-sr';
    label.textContent = text;

    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const chars = Array.from(text, (ch) => {
      const span = document.createElement('span');
      span.className = 'hl-char';
      span.textContent = ch;
      visual.appendChild(span);
      return span;
    });

    const caret = document.createElement('span');
    caret.className = 'hl-caret is-start';
    chars[0].appendChild(caret);

    title.replaceChildren(label, visual);
    title.classList.add('is-split');

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const fontWait = new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS));

    Promise.race([fontsReady, fontWait]).then(() => {
      let i = 0;
      function typeNext() {
        try {
          chars[i].classList.add('is-typed');
          chars[i].appendChild(caret);
          caret.classList.remove('is-start');
          i += 1;
          if (i < chars.length) { setTimeout(typeNext, TYPE_MS); return; }

          slideIn();
          setTimeout(() => {
            caret.classList.add('is-off');
            /* once the fade is done, put the heading back to plain text */
            setTimeout(() => {
              title.textContent = text;
              title.classList.replace('is-split', 'is-done');
            }, 450);
          }, CARET_LINGER_MS);
        } catch (err) { showAll(); }
      }
      setTimeout(typeNext, TYPE_START_MS);
    }).catch(showAll);
  }
})();
