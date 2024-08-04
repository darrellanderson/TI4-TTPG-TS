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
import { outlineMask } from "./lib/outline-mask";

const TOKENS: Array<string> = ["command", "control"];

for (const token of TOKENS) {
  const src: string = `./prebuild/icon/token/${token}.png`;
  const dst: string = `./assets/Textures/icon/token/${token}.png`;

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  fs.cpSync(src, dst);

  // Also create an opaque version for container icons.
  outlineMask(dst);
}
