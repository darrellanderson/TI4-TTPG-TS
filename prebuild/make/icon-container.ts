/**
 * Create icon PNGs with transparency.
 *
 * Input: prebuild/icon/token/*.png
 *
 * Output:
 * - assets/Textures/icon/token/*.png
 * - assets/Textures/icon/token/*.jpg (white background)
 */

import fs from "fs";
import path from "path";
import { opaqueJpg, outlineFeathered, outlineOnly } from "./lib/outline-mask";

const ICONS: Array<string> = ["recycle"];

async function process(icon: string) {
  const src: string = `./prebuild/icon/container/${icon}.png`;
  const dst: string = `./assets/Textures/icon/container/${icon}.png`;

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  fs.cpSync(src, dst);

  // Also create an opaque version for container icons.
  await opaqueJpg(dst);
  await outlineFeathered(dst);

  // Version which is only the outline.
  await outlineOnly(dst);
}

for (const icon of ICONS) {
  process(icon);
}
