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
import { opaqueJpg, outlineFeathered, outlineOnly } from "./lib/outline-mask";

const CLIP_CIRCLE_TOKENS: Array<string> = [""];

async function process(token: string) {
  const src: string = `./prebuild/token/${token}.jpg`;
  const dst: string = `./assets/Textures/icon/token/${token}.png`;

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  /*
  fs.cpSync(src, dst);

  // Also create an opaque version for container icons.
  await opaqueJpg(dst);
  await outlineFeathered(dst);

  // Version which is only the outline.
  await outlineOnly(dst);
  */
}

for (const token of CLIP_CIRCLE_TOKENS) {
  process(token);
}
