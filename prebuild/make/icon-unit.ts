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

import {
  center,
  opaqueJpg,
  outlineFeathered,
  outlineOnly,
} from "./lib/outline-mask";

const units: Set<UnitType> = new Set();

for (const unitAttrsDataArray of Object.values(SOURCE_TO_UNIT_ATTRS_DATA)) {
  for (const unitAttrsData of unitAttrsDataArray) {
    const unit: UnitType = unitAttrsData.unit;
    units.add(unit);
  }
}

async function processUnit(unit: UnitType) {
  const src: string = `./prebuild/icon/unit/${unit}.png`;
  const dst: string = `./assets/Textures/icon/unit/${unit}.png`;

  if (!fs.existsSync(src)) {
    throw new Error(`File not found: "${src}"`);
  }

  console.log(`Copying ${src} to ${dst}`);
  const dstDir: string = path.dirname(dst);
  fs.mkdirSync(dstDir, { recursive: true });
  fs.cpSync(src, dst);

  console.log(`Centering ${dst}`);
  await center(dst);

  // Also create an opaque version for container icons.
  await opaqueJpg(dst);
  await outlineFeathered(dst);

  // Version which is only the outline.
  await outlineOnly(dst);
}

for (const unit of units) {
  processUnit(unit);
}
