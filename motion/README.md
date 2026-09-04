# All Eyes on Independents — motion poster

A 1080 × 1350 event-poster animation, 60 fps, 2.5 s, animated word by word.
The frame is a React component; [Remotion](https://www.remotion.dev) renders it once per
frame and encodes the result, so the timing lives in code rather than in a timeline.

The rendered file is committed at `../assets/all-eyes-on-independents.mp4` and plays on
`../poster.html`. This folder is the source it came from.

## Running it

```bash
cd motion
npm install
npm run studio     # interactive preview + timeline at localhost:3000
npm run render     # → ../assets/all-eyes-on-independents.mp4
npm run still      # → ../assets/all-eyes-on-independents.jpg (the video's poster frame)
npm run typecheck
```

`render` and `still` need a Chromium. Remotion downloads and manages its own by default;
to point it at one already on the machine, set `REMOTION_BROWSER` to the binary:

```bash
REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render
```

It must be `chrome-headless-shell` (or a Chrome old enough to still accept `--headless`) —
current Chrome releases have removed the old headless mode Remotion asks for.

## Where things live

| File | What it holds |
|---|---|
| `src/timing.ts` | Every number from the brief: durations, staggers, travel distances, the copy. |
| `src/easing.ts` | The two curves — the springy landing and the snappy departure. |
| `src/Poster.tsx` | Layout and the per-word transform. |
| `src/fonts.ts` | Loads Anton + Montserrat from `public/fonts`, holding the render until they're ready. |
| `public/fonts/` | The two woff2 files, copied from `@fontsource` by `npm run fonts`. |

## The timing

| | |
|---|---|
| Intro | 1 s per word, 100 ms forward stagger, from 3 canvas widths off the right edge |
| Landing | overshoot curve, peaking 18 px past the resting position |
| Settled | 1.4 s (headline 1.3 s) |
| Hold | 1.4 s → 1.64 s |
| Exit | 500 ms per word, 50 ms forward stagger, to 2 canvas widths off the left edge |
| Ends | last word clears at 2.34 s; the composition runs to 2.5 s |

Each block staggers its own words from its own zero, so the headline and the dates land
together. One stagger running across all nine words would land the last one at 1.8 s —
after the 1.64 s exit — and the brief asks for a hold in between.

## Two things worth knowing before you retune it

**Travel is measured in canvas widths, not in percentages of each word.** CSS percentages
are relative to the element, so `translateX(300%)` moves `/` about 60 px — it starts on top
of its neighbour rather than off-canvas. Canvas widths make "300% off-canvas" true for every
word and give the block a single travel distance.

**An overshoot is a fraction of that travel.** Over three canvas widths, a textbook
`easeOutBack` overshoots by 317 px, which is both a lurch and a collision: a word at its peak
sits that much closer to the word beside it. The curve in `src/easing.ts` peaks 18 px past
instead, against a 40 px word gap. Change `ENTER.from` and you have to re-check both.
