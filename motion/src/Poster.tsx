import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { OVERSHOOT, SNAP_OUT } from './easing';
import { DISPLAY, TEXT } from './fonts';
import { DATE_LINES, ENTER, EXIT, HEADLINE_LINES } from './timing';

const PAPER = '#EDE3CC';
const INK = '#0A1410';
const ACCENT = '#A5521F';
const MARGIN = 88;

/* One word. It travels in canvas widths (see timing.ts), so every word starts and
   ends genuinely outside the frame and the whole cascade moves at one speed. */
const Word: React.FC<{ index: number; color?: string; children: React.ReactNode }> = ({
  index,
  color,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const seconds = frame / fps;

  const entersAt = index * ENTER.stagger;
  const enter = interpolate(
    seconds,
    [entersAt, entersAt + ENTER.duration],
    [ENTER.from * width, 0],
    { easing: OVERSHOOT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const exitsAt = EXIT.start + index * EXIT.stagger;
  const exit = interpolate(
    seconds,
    [exitsAt, exitsAt + EXIT.duration],
    [0, EXIT.to * width],
    { easing: SNAP_OUT, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* Every word has settled (1.4s) before any word starts leaving (1.64s), so the
     two curves never overlap and can simply be summed. */
  return (
    <span
      style={{
        display: 'inline-block',
        transform: `translateX(${enter + exit}px)`,
        willChange: 'transform',
        color,
      }}
    >
      {children}
    </span>
  );
};

/* A block of lines whose words share one running index — the stagger reads across
   line breaks, so the headline cascades as a sentence, not as three lines. */
const Block: React.FC<{
  lines: string[][];
  style: React.CSSProperties;
  gap: string;
  accentOn?: (word: string) => boolean;
}> = ({ lines, style, gap, accentOn }) => {
  let index = -1;
  return (
    <div style={style}>
      {lines.map((words, lineNumber) => (
        <div key={lineNumber} style={{ display: 'flex', gap, whiteSpace: 'pre' }}>
          {words.map((word) => {
            index += 1;
            return (
              <Word
                key={`${lineNumber}-${word}-${index}`}
                index={index}
                color={accentOn?.(word) ? ACCENT : undefined}
              >
                {word}
              </Word>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Poster: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: PAPER,
      color: INK,
      /* The canvas is the only mask: words are clipped by the poster edge, which is
         what "off-canvas" has to mean for the entrance and the exit to read. */
      overflow: 'hidden',
      padding: MARGIN,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      textAlign: 'left',
    }}
  >
    <Block
      lines={HEADLINE_LINES}
      gap="0.26em"
      style={{
        fontFamily: DISPLAY,
        fontWeight: 400,
        fontSize: 152,
        lineHeight: 0.92,
        letterSpacing: '-0.005em',
        textTransform: 'uppercase',
        paddingTop: 40,
      }}
    />

    <Block
      lines={DATE_LINES}
      gap="0.40em"
      accentOn={(word) => word === '/' || word === '–'}
      style={{
        fontFamily: TEXT,
        fontWeight: 700,
        fontSize: 74,
        lineHeight: 1,
        letterSpacing: '0.02em',
        paddingBottom: 24,
      }}
    />
  </AbsoluteFill>
);
