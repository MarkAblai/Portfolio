import { Easing } from 'remotion';

/* Intro: overshoots past the resting position and settles back — the "springy
   landing". Applied to each word's own travel only; the stagger between words
   stays linear, as the brief asks.

   The overshoot is a fraction of the travel, and the travel here is three canvas
   widths, so the usual easeOutBack (0.34, 1.56, 0.64, 1) throws each word 317px
   past its mark — a lurch, not a landing. Worse, a word at its peak sits closer to
   its neighbour by that same amount, so a large overshoot closes the word gaps and
   the type collides mid-cascade. This curve peaks at 1.0054 — 18px past, against a
   40px headline word gap — which lands springy and never touches. Retune it (and
   re-check the gaps) if you change ENTER.from. */
export const OVERSHOOT = Easing.bezier(0.22, 1.14, 0.36, 1);

/* Outro: a breath of anticipation to the right (35px at this travel), then hard
   acceleration off the left edge. Snappier than a plain ease-in, and it reads as a
   departure rather than a fade. */
export const SNAP_OUT = Easing.bezier(0.62, -0.08, 0.86, 0.12);
