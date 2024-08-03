/**
 * Create icon PNGs with transparency.
 *
 * Input: prebuild/icon/unit/*.png
 *
 * Output:
 * - assets/Textures/icon/unit/*.png
 */

import fs from "fs";
import path from "path";

import { SOURCE_TO_UNIT_ATTRS_DATA } from "../../src/lib/unit-lib/data/unit-attrs.data";
import { UnitType } from "../../src/lib/unit-lib/schema/unit-attrs-schema";

for (const unitAttrsDataArray of Object.values(SOURCE_TO_UNIT_ATTRS_DATA)) {
  for (const unitAttrsData of unitAttrsDataArray) {
    const unit: UnitType = unitAttrsData.unit;
    const src: string = `./prebuild/icon/unit/${unit}.png`;
    const dst: string = `./assets/Textures/icon/unit/${unit}.png`;

    if (!fs.existsSync(src)) {
      throw new Error(`File not found: "${src}"`);
    }

    const dstDir: string = path.dirname(dst);
    fs.mkdirSync(dstDir, { recursive: true });
    fs.cpSync(src, dst);
  }
}
