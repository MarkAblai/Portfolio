import { continueRender, delayRender, staticFile } from 'remotion';

/* Fonts are vendored into public/ rather than fetched from a CDN: the render must
   be byte-identical offline, and a webfont that arrives late renders a frame in
   the fallback face. delayRender holds every frame until both faces are ready. */

export const DISPLAY = 'Anton';
export const TEXT = 'Montserrat';

const handle = delayRender('Loading Anton and Montserrat');

const faces = [
  new FontFace(DISPLAY, `url(${staticFile('fonts/anton-400.woff2')}) format('woff2')`, {
    weight: '400',
  }),
  new FontFace(TEXT, `url(${staticFile('fonts/montserrat-700.woff2')}) format('woff2')`, {
    weight: '700',
  }),
];

Promise.all(
  faces.map((face) => face.load().then((loaded) => document.fonts.add(loaded)))
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error('Font loading failed', err);
    continueRender(handle);
  });
