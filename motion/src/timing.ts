/* Every timing number the brief specifies, in one place, in seconds.
   Frames are derived from fps at read time, so changing FPS re-times nothing. */

export const FPS = 60;
export const DURATION_IN_FRAMES = 150; // 2.5s — the brief's "finish around 2.5 seconds"

export const CANVAS = { width: 1080, height: 1350 };

/* Travel is measured in canvas widths, not in multiples of each word's own width.
   Percent-of-self is the CSS default and it breaks the brief: at 300% a narrow word
   like "/" moves ~60px, so it starts on top of its neighbour instead of off-canvas.
   Canvas widths make "300% off-canvas" literally true for every word and give the
   whole block one travel distance, so the stagger stays legible. */

/* Intro — each word flies in from the right and lands with a little overshoot. */
export const ENTER = {
  from: 3,        // canvas widths off the right edge
  duration: 1,    // s, per word
  stagger: 0.1,   // s between words, forward order, spaced linearly
};

/* Outro — each word leaves to the left, faster and tighter than it arrived. */
export const EXIT = {
  to: -2,         // canvas widths off the left edge
  start: 1.64,    // s
  duration: 0.5,  // s, per word
  stagger: 0.05,  // s between words, forward order, spaced linearly
};

/* Each block staggers its own words from its own zero, so the two blocks land
   together. Running one stagger across all nine words would push the last word's
   landing to 1.8s — past the 1.64s exit — and the brief asks for a hold between
   the two, so the blocks must be concurrent. */
export const HEADLINE_LINES = [['All', 'Eyes'], ['on'], ['Independents']];
export const DATE_LINES = [['January', '/', '19', '–', '21']];

/* When the composition is fully settled: headline 3 * 0.1 + 1 = 1.3s,
   dates 4 * 0.1 + 1 = 1.4s. The hold runs from there to the 1.64s exit. */
export const SETTLED_AT = 1.4;
