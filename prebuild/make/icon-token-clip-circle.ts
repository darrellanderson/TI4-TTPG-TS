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
import {
  clipCircle,
  opaqueJpg,
  outlineFeathered,
  outlineFeatheredNoCenter,
  outlineOnly,
} from "./lib/outline-mask";

const CLIP_CIRCLE_TOKENS: Array<string> = [
  "fighter-1",
  "fighter-3",
  "infantry-1",
  "infantry-3",
  "tradegood-commodity-1",
  "tradegood-commodity-3",
  "frontier",
];

async function process(token: string) {
  let src: string = `./prebuild/token/${token}.jpg`;
  const dst: string = `./assets/Textures/icon/token/${token}.png`;
  const circleFileName: string = `./assets/Textures/icon/token/circle.png`;

  if (token === "frontier") {
    src = `./prebuild/token/attachment/system/frontier.jpg`;
  }

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  await clipCircle(src, dst);

  // Also create an opaque version for container icons.
  // Use a shared mask created later.
  await opaqueJpg(dst, true);

  // These are all the same shape, create a single outline version.
  if (token === CLIP_CIRCLE_TOKENS[0]) {
    fs.cpSync(dst, circleFileName);
    await outlineOnly(circleFileName);
    await outlineFeathered(circleFileName);
    await outlineFeatheredNoCenter(circleFileName);
  }
}

for (const token of CLIP_CIRCLE_TOKENS) {
  process(token);
}
