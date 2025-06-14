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

import { center, opaqueJpg, outlineFeathered } from "./lib/outline-mask";
import { sustained } from "./lib/sustained";

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

  // Solid red bleed to edge with black feathered outline.
  await outlineFeathered(dst);

  // Sustained creates:
  // 1. x-mask.png : red mask of unit
  // 2. x-outlined.png : white outline with unit inside
  // 3. x-outline-only.png : white outline with transparent inside
  // 4. x-sustained.png : x-outlined.png with outlined sustain icon atop
  // 5. x-sustained-mask.png : red mask of unit portion of x-sustained.png
  await sustained(dst, `./prebuild/icon/unit/sustained-sad.png`);
}

for (const unit of units) {
  processUnit(unit);
}
