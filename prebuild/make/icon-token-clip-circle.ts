/**
 * Create icon PNGs with transparency.
 *
 * Input: prebuild/token/*.jpg
 *
 * Output:
 * - assets/Textures/icon/token/*.png
 * - assets/Textures/icon/token/*.jpg (white background)
 */

import fs from "fs";
import path from "path";
import { clipCircle, outlineOnly } from "./lib/outline-mask";

const CLIP_CIRCLE_TOKENS: Array<string> = [
  "fighter-1",
  "fighter-3",
  "infantry-1",
  "infantry-3",
  "tradegood-commodity-1",
  "tradegood-commodity-3",
];

async function process(token: string) {
  const src: string = `./prebuild/token/${token}.jpg`;
  const dst: string = `./assets/Textures/icon/token/${token}.png`;
  const circleFileName: string = `./assets/Textures/icon/token/circle.png`;

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  await clipCircle(src, dst);

  // These are all the same shape, create a single outline version.
  if (token === CLIP_CIRCLE_TOKENS[0]) {
    fs.cpSync(dst, circleFileName);
    await outlineOnly(circleFileName);
  }
}

for (const token of CLIP_CIRCLE_TOKENS) {
  process(token);
}
