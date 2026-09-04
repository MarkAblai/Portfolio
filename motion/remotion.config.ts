import { Config } from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setMuted(true); // the composition is silent — don't ship an empty AAC track

/* Point Remotion at a Chromium that is already on the machine instead of letting
   it download one — set REMOTION_BROWSER to that binary. Unset, Remotion falls
   back to its own managed Chrome Headless Shell. */
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
