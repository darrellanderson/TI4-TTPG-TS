import crypto from "crypto";
import fs from "fs";
import path from "path";

import { SOURCE_TO_SYSTEM_DATA } from "../../src/lib/system-lib/data/system.data";
import { TILE_SYSTEM_TEMPLATE } from "./tile-system.data";

type TileInfo = {
  guid: string;
  name: string;
  nsid: string;
  imgFileFace: string; // paths are relative to prebuild or assets/Textures
  imgFileBack: string;
  modelFileFace: string;
  modelFileBack: string;
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
    const imgFileFace: string = `tile/system/${source}/tile-${tileStr}.jpg`;
    const modelFileFace: string =
      systemSchema.class === "off-map"
        ? "tile/system/system-tile-off-map.face.obj"
        : "tile/system/system-tile.obj";
    const modelFileBack: string =
      systemSchema.class === "off-map"
        ? "tile/system/system-tile-off-map.back.obj"
        : "tile/system/system-tile.obj";

    const templateFile: string = `tile/system/${source}/tile-${tileStr}.json`;

    const guid: string = crypto
      .createHash("sha256")
      .update(templateFile)
      .digest("hex")
      .substring(0, 32)
      .toUpperCase();

    // Back will vary.
    let imgFileBack: string = "";
    if (systemSchema.imgFaceDown) {
      imgFileBack = `tile/system/${source}/tile-${tileStr}.back.jpg`;
    } else if (systemSchema.isHome) {
      imgFileBack = "tile/system/base/green.back.jpg";
    } else if (
      (systemSchema.anomalies ?? []).length > 0 ||
      (systemSchema.planets ?? []).length === 0
    ) {
      imgFileBack = "tile/system/base/red.back.jpg";
    } else {
      imgFileBack = "tile/system/base/blue.back.jpg";
    }

    tileInfos.push({
      guid,
      name,
      nsid,
      imgFileFace,
      imgFileBack,
      modelFileFace,
      modelFileBack,
      templateFile,
    });
  }
}

// Validate the input files.
for (const tileInfo of tileInfos) {
  if (!fs.existsSync("./prebuild/" + tileInfo.imgFileFace)) {
    console.error(`File not found: "${tileInfo.imgFileFace}"`);
  }
  if (!fs.existsSync("./prebuild/" + tileInfo.imgFileBack)) {
    console.error(`File not found: "${tileInfo.imgFileBack}"`);
  }
}

for (const tileInfo of tileInfos) {
  const json = JSON.parse(JSON.stringify(TILE_SYSTEM_TEMPLATE));
  json.GUID = tileInfo.guid;
  json.Name = tileInfo.name;
  json.Metadata = tileInfo.nsid;
  json.Models[0].Texture = tileInfo.imgFileFace;
  json.Models[1].Texture = tileInfo.imgFileBack;
  json.Models[0].Model = tileInfo.modelFileFace;
  json.Models[1].Model = tileInfo.modelFileBack;

  const templateFile: string = "./assets/Templates/" + tileInfo.templateFile;
  const templateDir: string = path.dirname(templateFile);
  const templateData: Buffer = Buffer.from(JSON.stringify(json, null, 2));

  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);

  fs.cpSync(
    "./prebuild/" + tileInfo.imgFileFace,
    "./assets/Textures/" + tileInfo.imgFileBack
  );
  fs.cpSync(
    "./prebuild/" + tileInfo.imgFileBack,
    "./assets/Textures/" + tileInfo.imgFileBack
  );
}
