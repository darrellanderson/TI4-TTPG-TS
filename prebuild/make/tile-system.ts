/**
 * Create system tile objects.
 *
 * Input: prebuild/tile/system/{source}/tile-{tile}.jpg
 * Output:
 * - assets/Templates/tile/system/{source}/tile-{tile}.json
 * - assets/Textures/tile/system/{source}/tile-{tile}.jpg
 */

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
const infos: Array<TileInfo> = [];
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

    infos.push({
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
const errors: Array<string> = [];
for (const info of infos) {
  if (!fs.existsSync("./prebuild/" + info.imgFileFace)) {
    errors.push(`File face not found: "${info.imgFileFace}"`);
  }
  if (!fs.existsSync("./prebuild/" + info.imgFileBack)) {
    errors.push(`File back not found: "${info.imgFileBack}"`);
  }
}
if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

for (const info of infos) {
  console.log(`Building tile: ${info.name}`);

  const json = JSON.parse(JSON.stringify(TILE_SYSTEM_TEMPLATE));
  json.GUID = info.guid;
  json.Name = info.name;
  json.Metadata = info.nsid;
  json.Models[0].Texture = info.imgFileFace;
  json.Models[1].Texture = info.imgFileBack;
  json.Models[0].Model = info.modelFileFace;
  json.Models[1].Model = info.modelFileBack;

  const templateFile: string = "./assets/Templates/" + info.templateFile;
  const templateDir: string = path.dirname(templateFile);
  const templateData: Buffer = Buffer.from(JSON.stringify(json, null, 2));

  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(templateFile, templateData);

  fs.cpSync(
    "./prebuild/" + info.imgFileFace,
    "./assets/Textures/" + info.imgFileFace
  );
  fs.cpSync(
    "./prebuild/" + info.imgFileBack,
    "./assets/Textures/" + info.imgFileBack
  );
}
