import fs from "fs";

import { SOURCE_TO_SYSTEM_DATA } from "../../src/lib/system-lib/data/system.data";

for (const [source, systemSchemas] of Object.entries(SOURCE_TO_SYSTEM_DATA)) {
  for (const systemSchema of systemSchemas) {
    const tile: number = systemSchema.tile;
    if (tile <= 0) {
      continue;
    }

    const tileStr: string = tile.toString().padStart(3, "0");
    const face: string = `tile/system/${source}/tile-${tileStr}.jpg`;
    let back: string = "";
    if (systemSchema.imgFaceDown) {
      back = `tile/system/${source}/tile-${tileStr}.back.jpg`;
    } else if (systemSchema.isHome) {
      back = "tile/system/base/green.back.png";
    } else if (
      (systemSchema.anomalies ?? []).length > 0 ||
      (systemSchema.planets ?? []).length === 0
    ) {
      back = "tile/system/base/red.back.png";
    } else {
      back = "tile/system/base/blue.back.png";
    }
    console.log(face, back);

    if (!fs.existsSync("./prebuild/" + face)) {
      console.error(`File not found: "${face}"`);
    }
    if (!fs.existsSync("./prebuild/" + back)) {
      console.error(`File not found: "${back}"`);
    }
  }
}
