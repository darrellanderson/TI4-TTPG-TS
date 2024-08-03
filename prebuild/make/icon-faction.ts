/**
 * Create faction icon PNGs with transparency.
 *
 * Input: prebuild/icon/faction/*.png
 *
 * Output:
 * - assets/Textures/icon/faction/*.png
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_FACTION_DATA } from "../../src/lib/faction-lib/data/faction.data";
for (const factionDataArray of Object.values(SOURCE_TO_FACTION_DATA)) {
  for (const factionData of factionDataArray) {
    let srcNsidName = factionData.nsidName;
    if (srcNsidName.includes("keleres")) {
      srcNsidName = "keleres";
    }
    const src: string = `./prebuild/icon/faction/${srcNsidName}.png`;
    const dst: string = `./assets/Textures/icon/faction/${factionData.nsidName}.png`;

    if (!fs.existsSync(src)) {
      throw new Error(`File not found: "${src}"`);
    }

    const dstDir: string = path.dirname(dst);
    fs.mkdirSync(dstDir, { recursive: true });
    fs.cpSync(src, dst);
  }
}
