import crypto from "crypto";
import fs from "fs";

import { SOURCE_TO_SYSTEM_DATA } from "../../src/lib/system-lib/data/system.data";

type TileInfo = {
  guid: string;
  name: string;
  nsid: string;
  faceImgFile: string; // paths are relative to prebuild or assets/Textures
  backImgFile: string;
  templateFile: string;
};

// Assemble tile info records.
const tileInfos: Array<TileInfo> = [];
for (const [source, systemSchemas] of Object.entries(SOURCE_TO_SYSTEM_DATA)) {
  for (const systemSchema of systemSchemas) {
    const tile: number = systemSchema.tile;
    if (tile <= 0) {
      continue;
    }

    const tileStr: string = tile.toString().padStart(3, "0");
    const name: string = `Tile ${tileStr}`;
    const nsid: string = `tile.system:${source}/${tile}`;
    const faceImgFile: string = `tile/system/${source}/tile-${tileStr}.jpg`;
    const templateFile: string = `tile/system/${source}/tile-${tileStr}.json`;

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    // Back will vary.
    let backImgFile: string = "";
    if (systemSchema.imgFaceDown) {
      backImgFile = `tile/system/${source}/tile-${tileStr}.back.jpg`;
    } else if (systemSchema.isHome) {
      backImgFile = "tile/system/base/green.back.jpg";
    } else if (
      (systemSchema.anomalies ?? []).length > 0 ||
      (systemSchema.planets ?? []).length === 0
    ) {
      backImgFile = "tile/system/base/red.back.jpg";
    } else {
      backImgFile = "tile/system/base/blue.back.jpg";
    }

    tileInfos.push({
      guid,
      name,
      nsid,
      faceImgFile,
      backImgFile,
      templateFile,
    });
  }
}

// Validate the input files.
for (const tileInfo of tileInfos) {
  if (!fs.existsSync("./prebuild/" + tileInfo.faceImgFile)) {
    console.error(`File not found: "${tileInfo.faceImgFile}"`);
  }
  if (!fs.existsSync("./prebuild/" + tileInfo.backImgFile)) {
    console.error(`File not found: "${tileInfo.backImgFile}"`);
  }
}
