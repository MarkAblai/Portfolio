import React from 'react';
import { Composition } from 'remotion';
import { Poster } from './Poster';
import { CANVAS, DURATION_IN_FRAMES, FPS } from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Poster"
    component={Poster}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={CANVAS.width}
    height={CANVAS.height}
  />
);
