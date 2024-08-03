/**
 * Create icon PNGs with transparency.
 *
 * Input: prebuild/icon/token/*.png
 *
 * Output:
 * - assets/Textures/icon/token/*.png
 */

import fs from "fs";
import path from "path";

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
}
